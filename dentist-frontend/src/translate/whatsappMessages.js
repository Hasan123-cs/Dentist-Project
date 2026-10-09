export const appointmentReminderArabic = (
    patientName,
    date,
    time
) => {

    return `
مرحباً ${patientName}

نذكركم بأن لديكم موعداً في عيادة الأسنان.

التاريخ: ${date || "-"}
الوقت: ${time || "-"}

شكراً لثقتكم بنا.
`;

};





export const cleaningReminderArabic = (
    patientName
) => {

    return `
مرحباً ${patientName}

حان موعد تذكيركم بتنظيف الأسنان الدوري.

يرجى التواصل معنا لحجز موعد جديد.

شكراً لثقتكم بنا.
`;

};







export const appointmentReminderEnglish = (
    patientName,
    date,
    time
) => {

    return `
Hello ${patientName}

This is a reminder that you have a dental appointment.

Date: ${date}
Time: ${time}

Thank you for trusting us.
`;

};







export const cleaningReminderEnglish = (
    patientName
) => {

    return `
Hello ${patientName}

This is a reminder that your periodic dental cleaning is due.

Please contact us to schedule your next appointment.

Thank you for trusting us.
`;

};