<template>
    <button @click="handleLogin" class="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
        Login
        <div
            class="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30">
        </div>
    </button>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const { loginWithRedirect } = useAuth0();

const handleLogin = () => {
    loginWithRedirect({
        appState: {
            target: './home'
        }
    })
    window.history.replaceState({}, '', './home')
}
</script>

<style lang="scss" scoped></style>