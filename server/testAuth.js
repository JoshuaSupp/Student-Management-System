const axios = require("axios");

const token = "ya29.c.c0ASRK0GYPLXx9phVVn-hQwasQyTS4Wx8EtXdvoajZdNeho9s-TOqt2ByWS_iD6op98v8q99zZ1oEKgMgYk9g3ozJIvh4L5m2aRfnMMr5-AD8kbCiQJntabkIklnLvGLG6riHHDjumx4UztRDDgPh5bz3CCwypcpr0RenJk5O4VC7R-dLXUpONL7ce6efoWzz66Ad3maiT3jXN6bageS5EAx3liqkrVkD7KNQOcugUTAzNdMeOsv_HTnAH598jI12UdBJE0Yv97g4gezPQdILgzQYjA0zcZByLBpHa-OmmLCwb4QPgKTSr9-dTb1zTi1NDCjCSiojU8IteTTUI2m_Z_1xWFpi_ONHQhNLhSuO8mcQCYm7HCGLiT6UN384COlgmg5w4s7paymoguZov9cv2W8mcJ8Wmmo4mM7gJXOa-FhdZ_lkQVMRe0nfg4XScS-2frBVouyy09gl5uVvvcm9S0aVXuBqS60krZJtfanXzZnIYkhdJlFV-8SBXBlMSSMV_49tVJ7Sr41Ye7VgQiUIIwwxnReqUq4tYJ21_FfxxdxisjY0_J3oQxlVkuFZi9eVV3xZdXB-tsgw5uI_YW6wfbQBkUlbJBlua9F9-0ojZ6SBhS-8V5_17FFWunFIW0iSOqRUvUZ5i-_urBJUuFUb-dq5BOgfRBtge3vs8sybQ4uJWQ08asF0cOZb5y8UXVYaq6JO7k3eJV8BWa5YtognmonhUxq9Rnxo4e9cmxXMZ4yzkOvF0czYW1nSviVXbOq2Ytdp_odpuQUx5_yB5dtJ9Y7VVtQ9aweccZvpc1uu589UX4_JsoO2445sd_ign_uVJl7Y6bsr-c7RUO84O69Bev2ZFQ2Q0l7eqmd4muffW8mXxfVSW1Od5pUsm5MckJh_b_r_QYat882OtoznyczIrwUJ4ZUqz4fdhaQXqF6tZzebqaM-sJfqjXjwhsnpjoys_q6W344dS4MoWWO5MmciRU4ZOoijWzIzFh__uXp1l5rf2z8eUjcr-sVW"; // Your OAuth token
const apiUrl = "https://www.googleapis.com/calendar/v3/users/me/calendarList";

axios.get(apiUrl, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json"
  }
})
.then(response => console.log("✅ Success:", response.data))
.catch(error => console.error("❌ Error:", error.response.data));
