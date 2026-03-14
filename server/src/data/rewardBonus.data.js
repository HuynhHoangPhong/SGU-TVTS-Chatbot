export const rewardBonusRules = {
    nationalInternational: {
        label: "Thí sinh đạt giải cấp quốc gia, quốc tế (không sử dụng quyền tuyển thẳng)",
        PT3_PT4: {
            subjectInCombination: {
                "Giải nhất": 3.0,
                "Giải nhì": 2.0,
                "Giải ba": 1.5,
                "Giải khuyến khích": 1.0,
            },
            subjectNotInCombination: {
                "Giải nhất": 1.0,
                "Giải nhì": 0.75,
                "Giải ba": 0.5,
                "Giải khuyến khích": null,
            },
        },
        PT2: {
            subjectInCombination: null,
            subjectNotInCombination: {
                "Giải nhất": 1.0,
                "Giải nhì": 0.75,
                "Giải ba": 0.5,
                "Giải khuyến khích": null,
            },
        },
    },

    provincialCity: {
        label: "Thí sinh đạt giải học sinh giỏi cấp tỉnh hoặc thành phố trực thuộc Trung ương",
        PT3_PT4: {
            subjectInCombination: {
                "Giải nhất": 1.0,
                "Giải nhì": 0.75,
                "Giải ba": 0.5,
                "Giải khuyến khích": null,
            },
            subjectNotInCombination: null,
        },
        PT2: {
            subjectInCombination: null,
            subjectNotInCombination: null,
        },
    },

    note: "Mức điểm thưởng, điểm xét thưởng được tính trên thang điểm 30.",
};

export const rewardBonusKeywords = [
    {
        type: "nationalInternational",
        keywords: [
            "quốc gia",
            "quoc gia",
            "quốc tế",
            "quoc te",
            "học sinh giỏi quốc gia",
            "hoc sinh gioi quoc gia",
        ],
        label: "Giải cấp quốc gia, quốc tế",
    },
    {
        type: "provincialCity",
        keywords: [
            "cấp tỉnh",
            "cap tinh",
            "thành phố",
            "thanh pho",
            "tỉnh",
            "tinh",
        ],
        label: "Giải cấp tỉnh hoặc thành phố trực thuộc Trung ương",
    },
];

export const rewardBonusGeneralInfo = {
    title: "Điểm thưởng và điểm xét thưởng",
    answer:
        "Phụ lục 5 quy định mức điểm thưởng, điểm xét thưởng cho thí sinh đạt giải học sinh giỏi hoặc đạt giải thưởng phù hợp. Mức điểm này áp dụng khác nhau tùy cấp giải, phương thức xét tuyển và việc môn đạt giải có thuộc tổ hợp môn xét tuyển hay không.",
    note: "Mức điểm thưởng và điểm xét thưởng được tính trên thang điểm 30.",
};