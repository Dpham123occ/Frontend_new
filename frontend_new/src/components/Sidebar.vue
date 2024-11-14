<template>
  <div class="side-nav">
    <!-- Logo Section -->
    <div class="logo-section">
      <img src="../assets/TSBlack.png" alt="Trailspur Logo" class="logo" />
    </div>
    <ul>
      <li><router-link to="/home">Home</router-link></li>
      <li>
        <router-link to="/appraisaldistrict">Appraisal District</router-link>
      </li>
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
    LogOutButton,
  },
  setup() {
    const { isAuthenticated } = useAuth0();
    return { isAuthenticated };
  },
};
</script>

<style scoped>
/* Logo Section */
.logo-section {
  margin-bottom: 2rem;
}

.logo {
  width: 180px;
  height: auto;
  object-fit: contain;
}
/* Sidebar container */
.side-nav {
  width: 250px;                /* Adjust width as needed */
  background-color: #d7e6e6;   /* Light teal background color */
  height: 100vh;               /* Full viewport height */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  position: fixed;             /* Fixed position to stay on the left side */
  box-sizing: border-box;
}

/* Navigation links */
.side-nav ul {
  list-style-type: none;       /* Remove bullet points */
  padding: 0;
  width: 100%;                 /* Make links span full sidebar width */
}

.side-nav li {
  width: 100%;                 /* Make each list item span full sidebar width */
}

.side-nav a {
  display: block;
  width: 100%;                 /* Make links span full sidebar width */
  color: #333;                 /* Dark text color */
  text-decoration: none;       /* Remove underline */
  font-size: 18px;             /* Adjust font size */
  padding: 15px 20px;          /* Spacing inside each link */
  text-align: left;
  box-sizing: border-box;      /* Ensures padding is inside the defined width */
  transition: background-color 0.3s ease;
}

.side-nav a:hover,
.side-nav a.active {
  background-color: #b8c2c2;   /* Lighter teal color on hover/active */
}

/* Log Out button styling */
.side-nav .logout-button {
  margin-top: auto;            /* Push the button to the bottom */
  background-color: #333;      /* Dark color for button */
  color: #fff;
  text-align: center;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  text-decoration: none;
  width: 80%;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
}

.side-nav .logout-button:hover {
  background-color: #000;
}

</style>
