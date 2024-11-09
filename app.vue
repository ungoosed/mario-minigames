<script setup>
// //supabase stuff
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(
//     "https://thvglmcnvcjyizzyyfsc.supabase.co",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodmdsbWNudmNqeWl6enl5ZnNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTMxMzE2NywiZXhwIjoyMDQ0ODg5MTY3fQ.EKzeV_hn69gs2qLuP4__1FYb22iRa3CBqBUIWdO3YkI",
// );
// const countries = ref([]);

// async function getCountries() {
//     const { data } = await supabase.from("countries").select();
//     countries.value = data;
//     // const { error } = await supabase
//     //     .from("countries")
//     //     .insert({ name: "Denmark" });
// }

// onMounted(() => {
//     getCountries();
// });
</script>

<template>
    <div>
        <ul>
            <!-- <li v-for="country in countries" :key="country.id">
                {{ country.name }}
            </li> -->
        </ul>
        <!-- <Chat id="hi" /> -->
        <Game />
    </div>
</template>
