import axios from "axios";

export class costarFileUploadService {
    constructor(apiGatewayConfig) {
      this.genPresignedUrlGateway = apiGatewayConfig.genPresignedUrlGateway;
      this.processCostarFileGateway = apiGatewayConfig.processCostarFileGateway;
      this.allowedFileTypes = ['.xlsx', '.xls', '.csv'];
    }
    
    validateFileType(file) {
        if (!file) return false;
        
        // Get the file extension
        const fileName = file.name || '';
        const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        
        

        // Check if the file extension is in the allowed list
        return this.allowedFileTypes.includes(fileExt);
      }
    
    getMimeType(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const mimeTypes = {
            'csv': 'text/csv',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        return mimeTypes[extension] || 'application/octet-stream'; // Fallback
    }

    async getPresignedUrl(fileName) {

        const content_type = this.getMimeType(fileName);

        const file_path = 'costar/' + fileName;

        try {
          const response = await axios.post(this.genPresignedUrlGateway, {
            body: {
              file_name: file_path,
              content_type: content_type,
            }
          }, {
            headers: {
                'Content-Type': 'application/json',
            },
          });
          
          // Check if status code is 200
          if (response.status === 200) {
            if (response.data.statusCode === 200) {
                // Parse the stringified body if needed
                const bodyContent = typeof response.data.body === 'string' 
                  ? JSON.parse(response.data.body) 
                  : response.data.body;
                  
                return bodyContent.presigned_url;
              } else {
                throw new Error(`API returned error status: ${response.data.statusCode}`);
              }
          } else {
            console.error('Unexpected status code:', response.status);
            throw new Error(`Failed to get presigned URL: Unexpected status code ${response.status}`);
          }
        } catch (error) {
          console.error('Error getting pre-signed URL:', error);
          throw new Error(`Error getting pre-signed URL: ${error.message}`);
        }
    }
  
    async uploadToS3(presignedUrl, file) {
        if (!presignedUrl) throw new Error('Missing pre-signed URL');
        if (!file) throw new Error('Missing file');

        try {
            const contentType = this.getMimeType(file.name);
            const response = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': contentType, // Ensure correct MIME type
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error details:', errorText);
                throw new Error(`Upload failed with status: ${response.status}, details: ${errorText}`);
            }

            return true;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    }
  
    async triggerLambdaProcessor(fileName) {

        const file_path = 'costar/' + fileName;

        try {
            const response = await axios.post(this.processCostarFileGateway, {
                body: { file_name: file_path }
            });
    
            if (response.status !== 200) { // Correct way to check status
                console.error("Unexpected status code:", response.status);
                throw new Error(`Failed to trigger Lambda: Status code ${response.status}`);
            }
    
            return response;
        } catch (error) {
            console.error("Error triggering Lambda", error);
            throw new Error(`Error triggering Lambda: ${error.message}`);
        }
    }
  
    async processFile(file) {
        // This method orchestrates the entire file processing workflow
        if (!this.validateFileType(file)) {
            throw new Error('Invalid file type. Only .xlsx, .xls, and .csv files are allowed.');
        }

        const presignedUrl = await this.getPresignedUrl(file.name);
        try{
            await this.uploadToS3(presignedUrl, file); 
        } catch (error) {
            console.error('Error Uploading file to s3:', error);
            throw new Error(`Error S3 Upload: ${error.message}`);
        }

        let costar_upload_response;
        try{
            costar_upload_response = await this.triggerLambdaProcessor(file.name);
        } catch (error) {
            console.error('Error processing file:', error);
            throw new Error(`Error Triggering Lambda: ${error.message}`);
        }
        return costar_upload_response;
    }
}