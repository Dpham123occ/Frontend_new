<template>
  <div class="side-nav">
    <ul>
      <li><router-link to="/home">Home</router-link></li>
      <li><router-link to="/appraisaldistrict">Appraisal District</router-link></li>
      <li><router-link to="/acquisitionlist">Acquisition List</router-link></li>
      <li v-if="isAuthenticated">
        <LogOutButton />
      </li>
    </ul>
  </div>
</template>

<script>
  import LogOutButton from './button/LogOutButton.vue';
  import { useAuth0 } from '@auth0/auth0-vue';

  export default {
    components: {
      LogOutButton
    },
    setup() {
      const { isAuthenticated } = useAuth0();
      return { isAuthenticated };
    }
  };
</script>

<style scoped>
/* Side Navigation container */
.side-nav {
  width: 200px;                /* Adjust width as needed */
  background-color: #F5F5F5;    /* Light gray background color */
  border-radius: 8px;           /* Rounded corners */
  padding: 20px;                /* Spacing inside the navbar */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100vh;                /* Full vertical height */
  position: fixed;              /* Fix the sidebar on the screen */
  top: 0;
  left: 0;
}

/* Remove bullet points and default list styling */
.side-nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;                  /* Ensure links take up full width */
}

/* Navigation links */
.side-nav a {
  display: flex;
  align-items: center;
  color: #000;                  /* Black text color */
  text-decoration: none;        /* Remove underline */
  font-size: 16px;
  font-weight:bold;             /* Adjust font size */
  padding: 10px 0;              /* Vertical spacing between links */
  margin-left: 10px;            /* Indent links to match design */
  width: 100%;
  border-radius: 4px;           /* Slight rounding for link backgrounds */
}

.side-nav a:hover {
  background-color:#d8d2c4 ;    /* Light gray on hover */
}

.side-nav a.active {
  background-color: #C5C5C5;    /* Darker gray for active link */
  font-weight: bold;            /* Bold text for active link */
}
</style>
