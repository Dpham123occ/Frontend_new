<<template>
    <div>
        <button @click="handleLogin">Log In</button>
    </div>
</template>

<script setup>
    import { useAuth0 } from '@auth0/auth0-vue';
    const { loginWithRedirect} = useAuth0();

    const handleLogin = () => {
        loginWithRedirect({
            appState: {
                target: './home'
            }
        })
    }
</script>

<style lang="scss" scoped>

</style>