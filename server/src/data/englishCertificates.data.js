export const englishCertificateRules = {
    IELTS: [
        { min: 4.0, max: 4.0, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 4.5, max: 4.5, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 5.0, max: 5.0, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 5.5, max: 5.5, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 6.0, max: 6.0, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 6.5, max: 99, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    TOEFL_ITP: [
        { min: 450, max: 466, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 467, max: 483, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 484, max: 499, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 500, max: 542, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 543, max: 585, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 586, max: 999, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    TOEFL_IBT: [
        { min: 30, max: 35, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 36, max: 40, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 41, max: 45, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 46, max: 65, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 66, max: 79, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 80, max: 999, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    TOEIC_LR: [
        { min: 550, max: 625, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 630, max: 705, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 710, max: 780, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 785, max: 835, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 840, max: 890, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 895, max: 999, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    TOEIC_SPEAKING: [
        { min: 120, max: 130, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 131, max: 145, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 146, max: 159, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 160, max: 165, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 166, max: 170, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 171, max: 999, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    TOEIC_WRITING: [
        { min: 120, max: 130, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 131, max: 140, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 141, max: 149, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 150, max: 159, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 160, max: 169, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 170, max: 999, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    LINGUASKILL: [
        { min: 140, max: 146, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 147, max: 152, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 153, max: 159, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 160, max: 166, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 167, max: 172, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 173, max: 999, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    APTIS_GENERAL: [
        { min: 102, max: 117, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 118, max: 133, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 134, max: 152, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 153, max: 162, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 163, max: 172, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 173, max: 999, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    APTIS_ADVANCED: [
        { min: 74, max: 90, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 91, max: 108, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 109, max: 125, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 126, max: 139, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 140, max: 153, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 154, max: 999, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    VSTEP: [
        { min: 4.0, max: 4.0, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 4.5, max: 4.5, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 5.0, max: 5.5, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 6.0, max: 6.5, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 7.0, max: 7.5, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 8.0, max: 99, convertedScore: 10.0, bonusScore: 1.5 },
    ],

    PTE_ACADEMIC: [
        { min: 43, max: 48, convertedScore: 7.5, bonusScore: 0.25 },
        { min: 49, max: 53, convertedScore: 8.0, bonusScore: 0.5 },
        { min: 54, max: 58, convertedScore: 8.5, bonusScore: 0.75 },
        { min: 59, max: 64, convertedScore: 9.0, bonusScore: 1.0 },
        { min: 65, max: 70, convertedScore: 9.5, bonusScore: 1.25 },
        { min: 71, max: 999, convertedScore: 10.0, bonusScore: 1.5 },
    ],
};

export const englishCertificateKeywords = [
    {
        type: "IELTS",
        keywords: ["ielts"],
        label: "IELTS",
    },
    {
        type: "TOEFL_ITP",
        keywords: ["toefl itp", "itp"],
        label: "TOEFL ITP",
    },
    {
        type: "TOEFL_IBT",
        keywords: ["toefl ibt", "ibt"],
        label: "TOEFL iBT",
    },
    {
        type: "TOEIC_LR",
        keywords: ["toeic nghe doc", "toeic reading listening", "toeic l&r", "toeic lr", "toeic"],
        label: "TOEIC Nghe + Đọc",
    },
    {
        type: "TOEIC_SPEAKING",
        keywords: ["toeic noi", "toeic speaking"],
        label: "TOEIC Nói",
    },
    {
        type: "TOEIC_WRITING",
        keywords: ["toeic viet", "toeic writing"],
        label: "TOEIC Viết",
    },
    {
        type: "LINGUASKILL",
        keywords: ["linguaskill"],
        label: "Linguaskill",
    },
    {
        type: "APTIS_GENERAL",
        keywords: ["aptis general", "aptis esol general"],
        label: "Aptis ESOL (General)",
    },
    {
        type: "APTIS_ADVANCED",
        keywords: ["aptis advanced", "aptis esol advanced"],
        label: "Aptis ESOL (Advanced)",
    },
    {
        type: "VSTEP",
        keywords: ["vstep"],
        label: "VSTEP",
    },
    {
        type: "PTE_ACADEMIC",
        keywords: ["pte", "pte academic", "pearson"],
        label: "PTE Academic",
    },
];

export const englishCertificateGeneralInfo = {
    title: "Quy đổi chứng chỉ tiếng Anh",
    answer:
        "Trường có bảng quy đổi chứng chỉ tiếng Anh sang điểm xét tuyển môn Tiếng Anh và điểm khuyến khích xét tuyển đại học chính quy năm 2026. Các chứng chỉ được chấp nhận gồm IELTS, TOEFL ITP, TOEFL iBT, TOEIC, Linguaskill, Aptis ESOL, VSTEP và PTE Academic.",
    note:
        "Chứng chỉ phải còn thời hạn không quá 02 năm tính đến ngày 20/6/2026 và do đơn vị được Bộ GD&ĐT cấp phép tổ chức thi.",
};