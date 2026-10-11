export const appointmentReminderArabic = (
    patientName,
    date,
    time
) => {

    return `مرحبًا ${patientName} سيد/سيدة 🌸

هذا تذكير من عيادة الدكتورة أماني نصيف لطب الأسنان 🦷

📅 التاريخ: ${date}
⏰ الوقت: ${time}

لأي تعديل بالموعد يرجى الاتصال بنا 📞

📍 الموقع:
https://maps.app.goo.gl/HBrFE4x7kFTmj4U58?g_st=ic
`;

};





export const cleaningReminderArabic = (
    patientName
) => {

    return `مرحبًا ${patientName} سيد/سيدة 🌸

هذا تذكير من عيادة الدكتورة أماني نصيف لطب الأسنان 🦷

حان موعد تنظيف الأسنان الدوري الخاص بك.

للحجز أو لأي تعديل بالموعد يرجى الاتصال بنا 📞

شكرًا لثقتكم بنا 🤍

📍 الموقع:
https://maps.app.goo.gl/HBrFE4x7kFTmj4U58?g_st=ic
`;

};







export const appointmentReminderEnglish = (
    patientName,
    date,
    time
) => {

    return `Hello Mr/Ms ${patientName} 👋

This is a reminder from Dr. Amany Nseif’s dental clinic 🦷

📅 Date: ${date}
⏰ Time: ${time}

For any changes, please call us 📞

📍 Location:
https://maps.app.goo.gl/HBrFE4x7kFTmj4U58?g_st=ic
`;

};







export const cleaningReminderEnglish = (
    patientName
) => {

    return `Hello Mr/Ms ${patientName} 👋

This is a reminder from Dr. Amany Nseif’s dental clinic 🦷

Your periodic dental cleaning is due.

Please contact us to schedule your appointment or for any changes 📞

Thank you for trusting us 🌸

📍 Location:
https://maps.app.goo.gl/HBrFE4x7kFTmj4U58?g_st=ic
`;

};


export function appointmentReminderBoth(
    patientName,
    date,
    time
) {

    return `Hello Mr/Ms ${patientName} 👋

This is a reminder from Dr. Amany Nseif’s dental clinic 🦷

📅 Date: ${date}
⏰ Time: ${time}

For any changes, please call us 📞


-------------------------


مرحبًا ${patientName} سيد/سيدة 🌸

هذا تذكير من عيادة الدكتورة أماني نصيف لطب الأسنان 🦷

📅 التاريخ: ${date}
⏰ الوقت: ${time}

لأي تعديل بالموعد يرجى الاتصال بنا 📞


📍 Location / الموقع:
https://maps.app.goo.gl/HBrFE4x7kFTmj4U58?g_st=ic
`;
}



export function cleaningReminderBoth(
    patientName
) {
    return `Hello Mr/Ms ${patientName} 👋

This is a reminder from Dr. Amany Nseif’s dental clinic 🦷

Your periodic dental cleaning is due.

Please contact us to schedule your appointment or for any changes 📞

Thank you for trusting us 🌸


-------------------------


مرحبًا ${patientName} سيد/سيدة 🌸

هذا تذكير من عيادة الدكتورة أماني نصيف لطب الأسنان 🦷

حان موعد تنظيف الأسنان الدوري الخاص بك.

للحجز أو لأي تعديل بالموعد يرجى الاتصال بنا 📞

شكرًا لثقتكم بنا 🤍


📍 Location / الموقع:
https://maps.app.goo.gl/HBrFE4x7kFTmj4U58?g_st=ic
`;
}