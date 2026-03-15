import { faqData } from "../data/faq.data.js";
import { knowledgeData } from "../data/knowledge.data.js";
import { documentLinks } from "../data/documentLinks.data.js";
import { majorsData, admissionMethodsMap } from "../data/majors.data.js";
import { tuitionData } from "../data/tuition.data.js";
import {
    englishCertificateRules,
    englishCertificateKeywords,
    englishCertificateGeneralInfo,
} from "../data/englishCertificates.data.js";
import {
    directAdmissionData,
    directAdmissionGeneralInfo,
} from "../data/directAdmission.data.js";
import {
    rewardBonusRules,
    rewardBonusKeywords,
    rewardBonusGeneralInfo,
} from "../data/rewardBonus.data.js";
import { admissionOverviewData } from "../data/admissionOverview.data.js";
import { normalizeText } from "../utils/normalizeText.js";

const MAJOR_QUESTION_HINT =
    "Bạn có thể hỏi rõ theo ngành, ví dụ: “Công nghệ thông tin học phí bao nhiêu?”, “Ngôn ngữ Anh có những phương thức nào?” hoặc “Mã ngành Kế toán là gì?”";

function normalizeMessage(message) {
    return normalizeText(message || "");
}

function includesAny(text, keywords = []) {
    return keywords.some((keyword) => text.includes(normalizeText(keyword)));
}

function getKeywordScore(message, keyword) {
    const normalizedMessage = normalizeMessage(message);
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedKeyword || !normalizedMessage.includes(normalizedKeyword)) {
        return 0;
    }

    let score = 1;
    const tokens = new Set(normalizedMessage.split(" ").filter(Boolean));

    if (tokens.has(normalizedKeyword)) {
        score += 2;
    }

    if (normalizedKeyword.includes(" ")) score += 2;
    if (normalizedKeyword.length >= 12) score += 2;
    else if (normalizedKeyword.length >= 8) score += 1;

    const words = normalizedKeyword.split(" ").filter(Boolean);
    if (words.length >= 2 && words.every((word) => normalizedMessage.includes(word))) {
        score += 1;
    }

    return score;
}

function scoreItemByKeywords(message, keywords = []) {
    const matchedKeywords = [];
    let totalScore = 0;

    for (const keyword of keywords) {
        const score = getKeywordScore(message, keyword);

        if (score > 0) {
            matchedKeywords.push(keyword);
            totalScore += score;
        }
    }

    return {
        score: totalScore,
        matchedKeywords,
    };
}

function findBestMatch(message, data = [], minScore = 1) {
    let bestMatch = null;

    for (const item of data) {
        const result = scoreItemByKeywords(message, item.keywords || []);
        if (result.score < minScore) continue;

        if (
            !bestMatch ||
            result.score > bestMatch.score ||
            (result.score === bestMatch.score &&
                result.matchedKeywords.length > bestMatch.matchedKeywords.length)
        ) {
            bestMatch = {
                item,
                score: result.score,
                matchedKeywords: result.matchedKeywords,
            };
        }
    }

    return bestMatch;
}

function extractFirstNumber(message) {
    const normalized = String(message || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d")
        .replace(/,/g, ".");
    const match = normalized.match(/\d+(\.\d+)?/);
    return match ? Number(match[0]) : null;
}

function buildResponse({
    source,
    title = null,
    answer,
    document = null,
    needsClarification = false,
    suggestions = [],
}) {
    return {
        source,
        title,
        answer,
        document,
        needsClarification,
        suggestions,
    };
}

function buildFallbackAnswer(document = null) {
    return buildResponse({
        source: "fallback",
        answer:
            "Mình chưa tìm thấy câu trả lời thật sự phù hợp trong dữ liệu hiện tại. Bạn hãy hỏi rõ hơn về ngành học, học phí, phương thức xét tuyển, tổ hợp môn, chứng chỉ tiếng Anh, xét tuyển thẳng, điểm thưởng hoặc kỳ thi năng khiếu.",
        document,
        suggestions: [
            "Công nghệ thông tin có những phương thức nào?",
            "Ngôn ngữ Anh học phí bao nhiêu?",
            "IELTS 5.5 được quy đổi mấy điểm?",
        ],
    });
}

function buildGreetingAnswer(document = null) {
    return buildResponse({
        source: "greeting",
        title: "Chào bạn",
        answer:
            "Chào bạn. Mình có thể hỗ trợ tư vấn tuyển sinh SGU về ngành học, mã ngành, chỉ tiêu, phương thức xét tuyển, học phí, tổ hợp môn, chứng chỉ tiếng Anh, xét tuyển thẳng, điểm thưởng và thi năng khiếu năm 2026.",
        document,
    });
}

function buildClarifyAnswer(title, answer, document = null, suggestions = []) {
    return buildResponse({
        source: "clarify",
        title,
        answer,
        document,
        needsClarification: true,
        suggestions,
    });
}

function isGreeting(message) {
    const text = normalizeMessage(message);

    return (
        ["xin chao", "hello", "alo", "ad oi", "ban oi"].some((item) =>
            text.includes(item)
        ) || /^(chao|hi)\b/.test(text)
    );
}

function findFaqAnswer(message) {
    const bestMatch = findBestMatch(message, faqData, 2);
    if (!bestMatch) return null;

    return {
        source: "faq",
        title: bestMatch.item.title || null,
        answer: bestMatch.item.answer,
        score: bestMatch.score,
    };
}

function findKnowledgeAnswer(message) {
    const bestMatch = findBestMatch(message, knowledgeData, 2);
    if (!bestMatch) return null;

    return {
        source: "knowledge",
        title: bestMatch.item.title || null,
        answer: bestMatch.item.content,
        score: bestMatch.score,
    };
}

function getDocumentByIntent(intent) {
    const documentIdMap = {
        overview: 1,
        major: 2,
        admission_methods: 2,
        combinations: 3,
        english_certificate: 4,
        direct_admission: 5,
        reward_bonus: 6,
        tuition: 7,
        aptitude: 8,
    };

    const id = documentIdMap[intent];
    return documentLinks.find((item) => item.id === id) || null;
}

function findRelatedDocument(message, intent = null) {
    const bestMatch = findBestMatch(message, documentLinks, 2);
    return bestMatch?.item || (intent ? getDocumentByIntent(intent) : null);
}

function getMethodCodesFromMessage(message) {
    const text = normalizeMessage(message);
    return Object.keys(admissionMethodsMap).filter((code) =>
        text.includes(normalizeText(code))
    );
}

function isGeneralMajorPrompt(message) {
    const text = normalizeMessage(message);
    return (
        includesAny(text, [
            "hoc phi",
            "ma nganh",
            "ma xet tuyen",
            "chi tieu",
            "phuong thuc",
            "to hop",
            "nganh nao",
        ]) && !findMajorByMessage(message)
    );
}

function findMajorByMessage(message) {
    const normalizedMessage = normalizeMessage(message);
    let bestMatch = null;

    for (const item of majorsData) {
        const result = scoreItemByKeywords(message, [
            ...(item.keywords || []),
            item.programName,
            item.majorName,
            item.admissionCode,
            item.majorCode,
        ]);

        if (
            item.admissionCode &&
            normalizedMessage.includes(normalizeText(item.admissionCode))
        ) {
            result.score += 5;
        }

        if (item.majorCode && normalizedMessage.includes(normalizeText(item.majorCode))) {
            result.score += 4;
        }

        if (item.highQuality && includesAny(normalizedMessage, ["chat luong cao", "clc"])) {
            result.score += 2;
        }

        if (result.score <= 0) continue;

        if (!bestMatch || result.score > bestMatch.score) {
            bestMatch = { item, score: result.score };
        }
    }

    if (!bestMatch) return null;
    return bestMatch.score >= 3 ? bestMatch.item : null;
}

function isAdmissionOverviewQuestion(message) {
    return includesAny(normalizeMessage(message), [
        "ma truong",
        "ma co so dao tao",
        "ten truong",
        "truong dai hoc sai gon",
        "saigon university",
        "dia chi",
        "co so chinh",
        "website",
        "trang tuyen sinh",
        "so dien thoai",
        "phong dao tao",
        "pham vi tuyen sinh",
        "toan quoc",
        "chi tieu tong",
        "tong chi tieu",
        "5600",
        "hoc bong",
        "le phi",
        "phi thi",
        "phi xet tuyen",
        "vsat",
        "xettuyen sgu edu vn",
        "tuyensinh sgu edu vn",
    ]);
}

function buildAdmissionOverviewAnswer(message) {
    const text = normalizeMessage(message);

    if (includesAny(text, ["ma truong", "ma co so dao tao"])) {
        return buildResponse({
            source: "structured_admission_overview",
            title: "Mã trường",
            answer: `Mã cơ sở đào tạo trong tuyển sinh của ${admissionOverviewData.schoolName} là ${admissionOverviewData.schoolCode}.`,
            document: getDocumentByIntent("overview"),
        });
    }

    if (includesAny(text, ["ten truong", "saigon university"])) {
        return buildResponse({
            source: "structured_admission_overview",
            title: "Tên trường",
            answer: `Tên cơ sở đào tạo là ${admissionOverviewData.schoolName} (${admissionOverviewData.englishName}).`,
            document: getDocumentByIntent("overview"),
        });
    }

    if (includesAny(text, ["dia chi", "co so chinh", "o dau"])) {
        const addressLines = admissionOverviewData.addresses
            .map((item) => `${item.label}: ${item.address}`)
            .join("; ");

        return buildResponse({
            source: "structured_admission_overview",
            title: "Địa chỉ trường",
            answer: `Các địa chỉ được công bố gồm: ${addressLines}.`,
            document: getDocumentByIntent("overview"),
        });
    }

    if (includesAny(text, ["website", "trang tuyen sinh", "sgu edu vn"])) {
        return buildResponse({
            source: "structured_admission_overview",
            title: "Website tuyển sinh",
            answer: `Website chính thức của trường là ${admissionOverviewData.website}. Trang tuyển sinh là ${admissionOverviewData.admissionWebsite}. Trang đăng ký xét tuyển là ${admissionOverviewData.applicationWebsite}.`,
            document: getDocumentByIntent("overview"),
        });
    }

    if (includesAny(text, ["so dien thoai", "phong dao tao", "hotline"])) {
        return buildResponse({
            source: "structured_admission_overview",
            title: "Số điện thoại tuyển sinh",
            answer: `Số điện thoại liên hệ tuyển sinh của Phòng Đào tạo là ${admissionOverviewData.phoneNumbers.join(" và ")}.`,
            document: getDocumentByIntent("overview"),
        });
    }

    if (includesAny(text, ["pham vi tuyen sinh", "toan quoc"])) {
        return buildResponse({
            source: "structured_admission_overview",
            title: "Phạm vi tuyển sinh",
            answer: `Phạm vi tuyển sinh của trường là ${admissionOverviewData.scope.toLowerCase()}.`,
            document: getDocumentByIntent("overview"),
        });
    }

    if (includesAny(text, ["chi tieu tong", "tong chi tieu", "5600"])) {
        return buildResponse({
            source: "structured_admission_overview",
            title: "Tổng chỉ tiêu",
            answer: `Số lượng dự kiến xét tuyển tất cả các ngành năm 2026 là ${new Intl.NumberFormat("vi-VN").format(admissionOverviewData.totalQuota)} chỉ tiêu.`,
            document: getDocumentByIntent("overview"),
        });
    }

    if (includesAny(text, ["hoc bong"])) {
        return buildResponse({
            source: "structured_admission_overview",
            title: "Học bổng",
            answer: `Trường có học bổng tuyển sinh và học bổng khuyến khích học tập. Cụ thể: ${admissionOverviewData.scholarships.directAdmission} ${admissionOverviewData.scholarships.firstSemester} ${admissionOverviewData.scholarships.studyEncouragement}`,
            document: getDocumentByIntent("overview"),
        });
    }

    if (includesAny(text, ["le phi", "phi thi", "phi xet tuyen"])) {
        return buildResponse({
            source: "structured_admission_overview",
            title: "Lệ phí tuyển sinh",
            answer: `Lệ phí dự thi V-SAT là ${admissionOverviewData.admissionFees.vsatMultipleChoice} đối với các môn trắc nghiệm và ${admissionOverviewData.admissionFees.vsatMixed} đối với các môn thi trắc nghiệm và tự luận. Lệ phí thi năng khiếu là ${admissionOverviewData.admissionFees.aptitude}.`,
            document: getDocumentByIntent("overview"),
        });
    }

    if (includesAny(text, ["vsat"])) {
        return buildResponse({
            source: "structured_admission_overview",
            title: "V-SAT",
            answer: `Thí sinh đăng ký và dự thi V-SAT theo thông báo trên trang ${admissionOverviewData.vsatWebsite} của Trường Đại học Sài Gòn hoặc tại các trường được Bộ GD&ĐT cho phép tổ chức Kì thi V-SAT năm 2026.`,
            document: getDocumentByIntent("overview"),
        });
    }

    return buildResponse({
        source: "structured_admission_overview",
        title: "Thông tin tuyển sinh chung",
        answer: `${admissionOverviewData.schoolName} có mã trường ${admissionOverviewData.schoolCode}, tuyển sinh ${admissionOverviewData.trainingType.toLowerCase()}, phạm vi ${admissionOverviewData.scope.toLowerCase()}. Website tuyển sinh là ${admissionOverviewData.admissionWebsite}.`,
        document: getDocumentByIntent("overview"),
    });
}

function isAdmissionMethodQuestion(message) {
    return includesAny(normalizeMessage(message), [
        "phuong thuc",
        "phuong thuc xet tuyen",
        "cac phuong thuc xet tuyen",
        "nhung phuong thuc xet tuyen",
        "co nhung phuong thuc nao",
        "xet tuyen bang cach nao",
        "xet bang cach nao",
        "pt1",
        "pt2",
        "pt3",
        "pt4",
    ]);
}

function buildAdmissionMethodsGeneralAnswer(message) {
    const methodsText = Object.entries(admissionMethodsMap)
        .map(([code, label]) => `${code}: ${label}`)
        .join("; ");

    const major = findMajorByMessage(message);
    if (major) {
        const methodCodes = getMethodCodesFromMessage(message);
        const majorMethods = major.methods || [];

        if (methodCodes.length > 0) {
            const supported = methodCodes.filter((code) => majorMethods.includes(code));
            const unsupported = methodCodes.filter((code) => !majorMethods.includes(code));
            const chunks = [];

            if (supported.length) {
                chunks.push(
                    `${major.programName} có áp dụng ${supported
                        .map((code) => `${code} (${admissionMethodsMap[code]})`)
                        .join(", ")}`
                );
            }

            if (unsupported.length) {
                chunks.push(
                    `${major.programName} không áp dụng ${unsupported
                        .map((code) => `${code} (${admissionMethodsMap[code]})`)
                        .join(", ")}`
                );
            }

            return buildResponse({
                source: "structured_admission_methods_major",
                title: `Phương thức xét tuyển ${major.programName}`,
                answer: `${chunks.join(". ")}.`,
                document: getDocumentByIntent("admission_methods"),
            });
        }

        return buildResponse({
            source: "structured_admission_methods_major",
            title: `Phương thức xét tuyển ${major.programName}`,
            answer: `Chương trình ${major.programName} áp dụng các phương thức xét tuyển sau: ${majorMethods
                .map((code) => `${code} (${admissionMethodsMap[code] || code})`)
                .join(", ")}.`,
            document: getDocumentByIntent("admission_methods"),
        });
    }

    return buildResponse({
        source: "structured_admission_methods_general",
        title: "Các phương thức xét tuyển",
        answer: `Năm 2026, Trường Đại học Sài Gòn áp dụng các phương thức xét tuyển sau: ${methodsText}.`,
        document: getDocumentByIntent("admission_methods"),
    });
}

function isMajorQuestion(message) {
    return includesAny(normalizeMessage(message), [
        "ma xet tuyen",
        "ma nganh",
        "chi tieu",
        "so luong tuyen sinh",
        "nganh nao",
        "nganh",
        "chuong trinh",
    ]);
}

function buildMajorAnswer(message) {
    const major = findMajorByMessage(message);
    if (!major) return null;

    const text = normalizeMessage(message);
    const methodsText = (major.methods || [])
        .map((method) => `${method} (${admissionMethodsMap[method] || method})`)
        .join(", ");

    if (includesAny(text, ["ma xet tuyen"])) {
        return buildResponse({
            source: "structured_major",
            title: `Mã xét tuyển ${major.programName}`,
            answer: `Mã xét tuyển của chương trình ${major.programName} là ${major.admissionCode}. Mã ngành là ${major.majorCode}.`,
            document: getDocumentByIntent("major"),
        });
    }

    if (includesAny(text, ["ma nganh"])) {
        return buildResponse({
            source: "structured_major",
            title: `Mã ngành ${major.programName}`,
            answer: `Mã ngành của ${major.programName} là ${major.majorCode}. Mã xét tuyển là ${major.admissionCode}.`,
            document: getDocumentByIntent("major"),
        });
    }

    if (includesAny(text, ["chi tieu", "so luong tuyen sinh"])) {
        return buildResponse({
            source: "structured_major",
            title: `Chỉ tiêu ${major.programName}`,
            answer: `Chương trình ${major.programName} có chỉ tiêu dự kiến năm 2026 là ${major.quota} sinh viên.`,
            document: getDocumentByIntent("major"),
        });
    }

    return buildResponse({
        source: "structured_major",
        title: major.programName,
        answer: `${major.programName} có mã xét tuyển ${major.admissionCode}, mã ngành ${major.majorCode}, chỉ tiêu dự kiến ${major.quota} và áp dụng các phương thức: ${methodsText}.`,
        document: getDocumentByIntent("major"),
    });
}

function isTuitionQuestion(message) {
    return includesAny(normalizeMessage(message), ["hoc phi", "toan khoa", "chat luong cao"]);
}

function buildTuitionAnswer(message) {
    const major = findMajorByMessage(message);
    if (!major) {
        return buildClarifyAnswer(
            "Hỏi rõ ngành để tra học phí",
            `Mình đã nhận ra bạn đang hỏi về học phí nhưng chưa xác định được ngành cụ thể. ${MAJOR_QUESTION_HINT}`,
            getDocumentByIntent("tuition"),
            ["Công nghệ thông tin học phí bao nhiêu?", "Ngôn ngữ Anh chất lượng cao học phí bao nhiêu?"]
        );
    }

    const text = normalizeMessage(message);
    let matchedItem = null;
    let bestScore = 0;

    for (const item of tuitionData) {
        let score = scoreItemByKeywords(message, item.majors || []).score;

        if (includesAny(normalizeText(major.programName), item.majors || [])) {
            score += 5;
        }

        if (text.includes("chat luong cao") && item.type === "high_quality") {
            score += 3;
        }

        if (major.highQuality && item.type === "high_quality") {
            score += 3;
        }

        if (score > bestScore) {
            matchedItem = item;
            bestScore = score;
        }
    }

    if (!matchedItem || bestScore <= 0) return null;

    return buildResponse({
        source: "structured_tuition",
        title: `Học phí ${major.programName}`,
        answer: `Học phí dự kiến của ${major.programName} trong kỳ tuyển sinh đại học chính quy năm 2026 là ${matchedItem.displayFee} cho toàn khóa.`,
        document: getDocumentByIntent("tuition"),
    });
}

function isCombinationQuestion(message) {
    return includesAny(normalizeMessage(message), [
        "to hop",
        "to hop mon",
        "khoi xet tuyen",
        "mon xet tuyen",
        "thm",
        "he so mon",
        "cong thuc tinh diem",
    ]);
}

function buildCombinationAnswer(message) {
    const major = findMajorByMessage(message);

    if (major) {
        return buildResponse({
            source: "structured_combination",
            title: `Tổ hợp xét tuyển ${major.programName}`,
            answer: `Mình đã nhận diện bạn đang hỏi về chương trình ${major.programName}. Để xem chính xác các tổ hợp môn xét tuyển, hệ số môn và công thức tính điểm của chương trình này, bạn mở Phụ lục tổ hợp môn xét tuyển đi kèm bên dưới nhé.`,
            document: getDocumentByIntent("combinations"),
        });
    }

    return buildClarifyAnswer(
        "Tổ hợp môn xét tuyển",
        "Thông tin tổ hợp môn, hệ số môn và công thức tính điểm được công bố trong Phụ lục tổ hợp môn xét tuyển. Bạn hãy hỏi rõ theo ngành để mình định hướng nhanh hơn.",
        getDocumentByIntent("combinations"),
        ["Công nghệ thông tin xét tổ hợp nào?", "Kế toán có những tổ hợp môn nào?"]
    );
}

function isAptitudeQuestion(message) {
    return includesAny(normalizeMessage(message), [
        "thi nang khieu",
        "nang khieu",
        "su pham am nhac",
        "su pham my thuat",
        "giao duc mam non",
        "xuong am",
        "tham am",
        "hinh hoa",
        "trang tri",
        "ke chuyen",
        "hat",
    ]);
}

function buildAptitudeAnswer(message) {
    const text = normalizeMessage(message);

    if (includesAny(text, ["su pham am nhac", "xuong am", "tham am"])) {
        return buildResponse({
            source: "structured_aptitude_exam",
            title: "Thi năng khiếu Sư phạm Âm nhạc",
            answer:
                "Bạn đang hỏi về ngành Sư phạm Âm nhạc. Nội dung thi năng khiếu của ngành này nằm trong quyết định ban hành nội dung thi năng khiếu năm 2026. Bạn hãy mở file PDF liên quan bên dưới để xem đầy đủ phần xướng âm, thẩm âm và các yêu cầu cụ thể.",
            document: getDocumentByIntent("aptitude"),
        });
    }

    if (includesAny(text, ["su pham my thuat", "hinh hoa", "trang tri"])) {
        return buildResponse({
            source: "structured_aptitude_exam",
            title: "Thi năng khiếu Sư phạm Mỹ thuật",
            answer:
                "Bạn đang hỏi về ngành Sư phạm Mỹ thuật. Nội dung thi năng khiếu của ngành này được công bố trong quyết định ban hành nội dung thi năng khiếu năm 2026. Bạn mở file PDF liên quan bên dưới để xem chính xác phần hình họa, trang trí và thời gian làm bài.",
            document: getDocumentByIntent("aptitude"),
        });
    }

    if (includesAny(text, ["giao duc mam non", "ke chuyen", "hat"])) {
        return buildResponse({
            source: "structured_aptitude_exam",
            title: "Thi năng khiếu Giáo dục Mầm non",
            answer:
                "Bạn đang hỏi về ngành Giáo dục Mầm non. Nội dung thi năng khiếu được công bố trong quyết định ban hành nội dung thi năng khiếu năm 2026. Bạn mở file PDF liên quan bên dưới để xem chính xác phần kể chuyện, hát và yêu cầu chấm thi.",
            document: getDocumentByIntent("aptitude"),
        });
    }

    return buildResponse({
        source: "structured_aptitude_exam",
        title: "Kỳ thi năng khiếu",
        answer:
            "Thông tin chi tiết về nội dung thi năng khiếu năm 2026 được công bố trong quyết định ban hành nội dung thi năng khiếu. Bạn có thể hỏi rõ theo ngành như Sư phạm Âm nhạc, Sư phạm Mỹ thuật hoặc Giáo dục Mầm non để mình định hướng nhanh hơn.",
        document: getDocumentByIntent("aptitude"),
    });
}

function findCertificateType(message) {
    const normalizedMessage = normalizeMessage(message);
    let bestMatch = null;

    for (const item of englishCertificateKeywords) {
        const result = scoreItemByKeywords(normalizedMessage, item.keywords || []);
        if (result.score <= 0) continue;

        if (!bestMatch || result.score > bestMatch.score) {
            bestMatch = {
                type: item.type,
                label: item.label,
                score: result.score,
            };
        }
    }

    return bestMatch || null;
}

function findCertificateRule(rules = [], scoreValue) {
    return rules.find((rule) => scoreValue >= rule.min && scoreValue <= rule.max);
}

function isEnglishCertificateQuestion(message) {
    return includesAny(normalizeMessage(message), [
        "ielts",
        "toeic",
        "toefl",
        "aptis",
        "vstep",
        "pte",
        "linguaskill",
        "quy doi",
        "chung chi tieng anh",
        "diem khuyen khich",
    ]);
}

function buildEnglishCertificateAnswer(message) {
    const certificate = findCertificateType(message);
    const scoreValue = extractFirstNumber(message);

    if (!certificate) {
        return buildResponse({
            source: "structured_english_certificate",
            title: englishCertificateGeneralInfo.title,
            answer: `${englishCertificateGeneralInfo.answer} ${englishCertificateGeneralInfo.note}`,
            document: getDocumentByIntent("english_certificate"),
        });
    }

    const rules = englishCertificateRules[certificate.type] || [];

    if (scoreValue === null) {
        return buildClarifyAnswer(
            `Quy đổi ${certificate.label}`,
            `Trường có áp dụng quy đổi cho ${certificate.label}. Bạn hãy hỏi kèm mức điểm cụ thể, ví dụ: “IELTS 5.5 quy đổi bao nhiêu?” hoặc “TOEFL iBT 70 được mấy điểm?”.`,
            getDocumentByIntent("english_certificate")
        );
    }

    const matchedRule = findCertificateRule(rules, scoreValue);
    if (!matchedRule) {
        return buildResponse({
            source: "structured_english_certificate",
            title: `Quy đổi ${certificate.label}`,
            answer: `Mình chưa tìm thấy mức quy đổi phù hợp cho ${certificate.label} ${scoreValue} trong dữ liệu hiện tại. Bạn nên kiểm tra lại mức điểm hoặc xem thêm phụ lục quy đổi chứng chỉ tiếng Anh năm 2026.`,
            document: getDocumentByIntent("english_certificate"),
        });
    }

    return buildResponse({
        source: "structured_english_certificate",
        title: `Quy đổi ${certificate.label}`,
        answer: `${certificate.label} ${scoreValue} được quy đổi thành ${matchedRule.convertedScore} điểm môn Tiếng Anh và được cộng ${matchedRule.bonusScore} điểm khuyến khích.`,
        document: getDocumentByIntent("english_certificate"),
    });
}

function isDirectAdmissionQuestion(message) {
    return includesAny(normalizeMessage(message), [
        "xet tuyen thang",
        "tuyen thang",
        "hsg",
        "hoc sinh gioi",
        "giai thuong phu hop",
        "mon thi hsg",
    ]);
}

function buildDirectAdmissionAnswer(message) {
    const major = findMajorByMessage(message);
    if (!major) {
        return buildResponse({
            source: "structured_direct_admission",
            title: directAdmissionGeneralInfo.title,
            answer: directAdmissionGeneralInfo.answer,
            document: getDocumentByIntent("direct_admission"),
        });
    }

    const directItem = directAdmissionData.find(
        (item) => item.admissionCode === major.admissionCode
    );

    if (!directItem) return null;

    if (directItem.notApplicable) {
        return buildResponse({
            source: "structured_direct_admission",
            title: `Xét tuyển thẳng ${directItem.programName}`,
            answer: `Chương trình ${directItem.programName} hiện không áp dụng xét tuyển thẳng theo môn thi học sinh giỏi hoặc giải thưởng phù hợp trong Phụ lục 4.`,
            document: getDocumentByIntent("direct_admission"),
        });
    }

    return buildResponse({
        source: "structured_direct_admission",
        title: `Xét tuyển thẳng ${directItem.programName}`,
        answer: `Chương trình ${directItem.programName} có thể đăng ký xét tuyển thẳng theo các môn thi học sinh giỏi hoặc giải thưởng phù hợp sau: ${directItem.eligibleSubjects.join(", ")}.`,
        document: getDocumentByIntent("direct_admission"),
    });
}

function findRewardBonusType(message) {
    const normalizedMessage = normalizeMessage(message);
    let bestMatch = null;

    for (const item of rewardBonusKeywords) {
        const result = scoreItemByKeywords(normalizedMessage, item.keywords || []);
        if (result.score <= 0) continue;

        if (!bestMatch || result.score > bestMatch.score) {
            bestMatch = {
                type: item.type,
                label: item.label,
                score: result.score,
            };
        }
    }

    return bestMatch;
}

function isRewardBonusQuestion(message) {
    return includesAny(normalizeMessage(message), [
        "diem thuong",
        "diem xet thuong",
        "giai nhat",
        "giai nhi",
        "giai ba",
        "giai khuyen khich",
        "quoc gia",
        "quoc te",
        "cap tinh",
        "thanh pho",
    ]);
}

function buildRewardBonusAnswer(message) {
    const text = normalizeMessage(message);
    const bonusType = findRewardBonusType(message);

    if (!bonusType) {
        return buildResponse({
            source: "structured_reward_bonus",
            title: rewardBonusGeneralInfo.title,
            answer: `${rewardBonusGeneralInfo.answer} ${rewardBonusGeneralInfo.note}`,
            document: getDocumentByIntent("reward_bonus"),
        });
    }

    const isPT2 = text.includes("pt2");
    const notInCombination = includesAny(text, [
        "khong thuoc to hop",
        "ngoai to hop",
        "khong thuoc thm",
    ]);

    const rank =
        text.includes("giai nhat")
            ? "Giải nhất"
            : text.includes("giai nhi")
              ? "Giải nhì"
              : text.includes("giai ba")
                ? "Giải ba"
                : text.includes("khuyen khich")
                  ? "Giải khuyến khích"
                  : null;

    if (!rank) {
        return buildClarifyAnswer(
            rewardBonusGeneralInfo.title,
            `${rewardBonusGeneralInfo.answer} ${rewardBonusGeneralInfo.note} Bạn hãy hỏi rõ thêm cấp giải, thứ hạng và phương thức xét tuyển.`,
            getDocumentByIntent("reward_bonus")
        );
    }

    const rules = rewardBonusRules[bonusType.type];

    if (bonusType.type === "nationalInternational") {
        if (isPT2) {
            const value = rules.PT2.subjectNotInCombination[rank];
            return buildResponse({
                source: "structured_reward_bonus",
                title: `Điểm thưởng ${bonusType.label}`,
                answer:
                    value === null
                        ? `Với ${bonusType.label.toLowerCase()} ở phương thức 2, ${rank.toLowerCase()} không áp dụng điểm thưởng hoặc điểm xét thưởng.`
                        : `Với ${bonusType.label.toLowerCase()} ở phương thức 2, ${rank.toLowerCase()} được cộng ${value} điểm theo thang điểm 30.`,
                document: getDocumentByIntent("reward_bonus"),
            });
        }

        if (notInCombination) {
            const value = rules.PT3_PT4.subjectNotInCombination[rank];
            return buildResponse({
                source: "structured_reward_bonus",
                title: `Điểm thưởng ${bonusType.label}`,
                answer:
                    value === null
                        ? `Với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải không thuộc tổ hợp xét tuyển thì ${rank.toLowerCase()} không được áp dụng.`
                        : `Với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải không thuộc tổ hợp xét tuyển thì ${rank.toLowerCase()} được cộng ${value} điểm theo thang điểm 30.`,
                document: getDocumentByIntent("reward_bonus"),
            });
        }

        const value = rules.PT3_PT4.subjectInCombination[rank];
        return buildResponse({
            source: "structured_reward_bonus",
            title: `Điểm thưởng ${bonusType.label}`,
            answer: `Với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải thuộc tổ hợp xét tuyển thì ${rank.toLowerCase()} được cộng ${value} điểm theo thang điểm 30.`,
            document: getDocumentByIntent("reward_bonus"),
        });
    }

    if (bonusType.type === "provincialCity") {
        if (isPT2) {
            return buildResponse({
                source: "structured_reward_bonus",
                title: `Điểm thưởng ${bonusType.label}`,
                answer: `Đối với ${bonusType.label.toLowerCase()}, phương thức 2 không áp dụng điểm thưởng hoặc điểm xét thưởng.`,
                document: getDocumentByIntent("reward_bonus"),
            });
        }

        if (notInCombination) {
            return buildResponse({
                source: "structured_reward_bonus",
                title: `Điểm thưởng ${bonusType.label}`,
                answer: `Đối với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải không thuộc tổ hợp xét tuyển thì không áp dụng điểm thưởng hoặc điểm xét thưởng.`,
                document: getDocumentByIntent("reward_bonus"),
            });
        }

        const value = rules.PT3_PT4.subjectInCombination[rank];
        return buildResponse({
            source: "structured_reward_bonus",
            title: `Điểm thưởng ${bonusType.label}`,
            answer:
                value === null
                    ? `Đối với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, ${rank.toLowerCase()} không áp dụng điểm thưởng hoặc điểm xét thưởng.`
                    : `Đối với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải thuộc tổ hợp xét tuyển thì ${rank.toLowerCase()} được cộng ${value} điểm theo thang điểm 30.`,
            document: getDocumentByIntent("reward_bonus"),
        });
    }

    return null;
}

function chooseHigherPriorityResult(...results) {
    return results.find(Boolean) || null;
}

function buildStructuredAnswer(message) {
    if (isEnglishCertificateQuestion(message)) {
        return buildEnglishCertificateAnswer(message);
    }

    if (isTuitionQuestion(message)) {
        return buildTuitionAnswer(message);
    }

    if (isDirectAdmissionQuestion(message)) {
        return buildDirectAdmissionAnswer(message);
    }

    if (isRewardBonusQuestion(message)) {
        return buildRewardBonusAnswer(message);
    }

    if (isAptitudeQuestion(message)) {
        return buildAptitudeAnswer(message);
    }

    if (isCombinationQuestion(message)) {
        return buildCombinationAnswer(message);
    }

    if (isAdmissionOverviewQuestion(message)) {
        return buildAdmissionOverviewAnswer(message);
    }

    if (isAdmissionMethodQuestion(message)) {
        return buildAdmissionMethodsGeneralAnswer(message);
    }

    if (isMajorQuestion(message)) {
        return buildMajorAnswer(message);
    }

    if (isGeneralMajorPrompt(message)) {
        return buildClarifyAnswer(
            "Cần thêm tên ngành",
            `Mình nhận ra bạn đang hỏi về thông tin tuyển sinh theo ngành nhưng chưa xác định được ngành cụ thể. ${MAJOR_QUESTION_HINT}`,
            getDocumentByIntent("major")
        );
    }

    return null;
}

export function getChatbotResponse(message) {
    if (isGreeting(message)) {
        return buildGreetingAnswer(findRelatedDocument(message, "overview"));
    }

    const structuredResult = buildStructuredAnswer(message);
    if (structuredResult) {
        if (!structuredResult.document) {
            structuredResult.document = findRelatedDocument(message);
        }
        return structuredResult;
    }

    const faqResult = findFaqAnswer(message);
    const knowledgeResult = findKnowledgeAnswer(message);

    let baseResult = null;
    if (faqResult && knowledgeResult) {
        baseResult = faqResult.score >= knowledgeResult.score ? faqResult : knowledgeResult;
    } else {
        baseResult = chooseHigherPriorityResult(faqResult, knowledgeResult);
    }

    if (baseResult) {
        return buildResponse({
            source: baseResult.source,
            title: baseResult.title,
            answer: baseResult.answer,
            document: findRelatedDocument(message),
        });
    }

    return buildFallbackAnswer(findRelatedDocument(message));
}