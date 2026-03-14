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

function normalizeMessage(message) {
    return normalizeText(message || "");
}

function includesAny(text, keywords = []) {
    return keywords.some((keyword) => text.includes(normalizeText(keyword)));
}

function getKeywordScore(message, keyword) {
    const normalizedMessage = normalizeMessage(message);
    const normalizedKeyword = normalizeText(keyword);

    if (!normalizedKeyword) return 0;
    if (!normalizedMessage.includes(normalizedKeyword)) return 0;

    let score = 1;

    if (normalizedKeyword.includes(" ")) {
        score += 2;
    }

    if (normalizedKeyword.length >= 12) {
        score += 2;
    } else if (normalizedKeyword.length >= 8) {
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

        if (!bestMatch) {
            bestMatch = {
                item,
                score: result.score,
                matchedKeywords: result.matchedKeywords,
            };
            continue;
        }

        const currentMatchedCount = result.matchedKeywords.length;
        const bestMatchedCount = bestMatch.matchedKeywords.length;

        if (result.score > bestMatch.score) {
            bestMatch = {
                item,
                score: result.score,
                matchedKeywords: result.matchedKeywords,
            };
            continue;
        }

        if (
            result.score === bestMatch.score &&
            currentMatchedCount > bestMatchedCount
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
    const normalized = normalizeMessage(message).replace(/,/g, ".");
    const match = normalized.match(/\d+(\.\d+)?/);
    return match ? Number(match[0]) : null;
}

function buildFallbackAnswer() {
    return {
        source: "fallback",
        answer:
            "Mình chưa tìm thấy câu trả lời thật sự phù hợp trong dữ liệu hiện tại. Bạn có thể hỏi rõ hơn về ngành học, học phí, phương thức xét tuyển, tổ hợp môn, chứng chỉ tiếng Anh, xét tuyển thẳng, điểm thưởng hoặc kỳ thi năng khiếu.",
        title: null,
        score: 0,
    };
}

function buildGreetingAnswer() {
    return {
        source: "greeting",
        title: "Chào bạn",
        answer:
            "Chào bạn. Mình có thể hỗ trợ tư vấn tuyển sinh SGU về ngành học, mã ngành, chỉ tiêu, phương thức xét tuyển, học phí, tổ hợp môn, chứng chỉ tiếng Anh, xét tuyển thẳng, điểm thưởng và thi năng khiếu năm 2026.",
    };
}

function isGreeting(message) {
    const text = normalizeMessage(message);

    return (
        ["xin chao", "hello", "alo", "ad oi", "ban oi"].some((item) =>
            text.includes(item)
        ) ||
        /^(chao|hi)\b/.test(text)
    );
}

function findFaqAnswer(message) {
    const bestMatch = findBestMatch(message, faqData, 2);

    if (!bestMatch) return null;

    return {
        source: "faq",
        answer: bestMatch.item.answer,
        title: bestMatch.item.title || null,
        score: bestMatch.score,
    };
}

function findKnowledgeAnswer(message) {
    const bestMatch = findBestMatch(message, knowledgeData, 2);

    if (!bestMatch) return null;

    return {
        source: "knowledge",
        answer: bestMatch.item.content,
        title: bestMatch.item.title || null,
        score: bestMatch.score,
    };
}

function findRelatedDocument(message) {
    const bestMatch = findBestMatch(message, documentLinks, 2);

    if (!bestMatch) return null;

    return {
        title: bestMatch.item.title,
        url: bestMatch.item.url,
    };
}

function isAdmissionOverviewQuestion(message) {
    const text = normalizeMessage(message);

    return includesAny(text, [
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
        "xettuyen.sgu.edu.vn",
        "tuyensinh.sgu.edu.vn",
    ]);
}

function buildAdmissionOverviewAnswer(message) {
    const text = normalizeMessage(message);

    if (includesAny(text, ["ma truong", "ma co so dao tao"])) {
        return {
            source: "structured_admission_overview",
            title: "Mã trường",
            answer: `Mã cơ sở đào tạo trong tuyển sinh của ${admissionOverviewData.schoolName} là ${admissionOverviewData.schoolCode}.`,
        };
    }

    if (includesAny(text, ["ten truong", "saigon university"])) {
        return {
            source: "structured_admission_overview",
            title: "Tên trường",
            answer: `Tên cơ sở đào tạo là ${admissionOverviewData.schoolName} (${admissionOverviewData.englishName}).`,
        };
    }

    if (includesAny(text, ["dia chi", "co so chinh", "o dau"])) {
        const addressLines = admissionOverviewData.addresses
            .map((item) => `${item.label}: ${item.address}`)
            .join("; ");

        return {
            source: "structured_admission_overview",
            title: "Địa chỉ trường",
            answer: `Các địa chỉ được công bố gồm: ${addressLines}.`,
        };
    }

    if (includesAny(text, ["website", "trang tuyen sinh", "sgu.edu.vn"])) {
        return {
            source: "structured_admission_overview",
            title: "Website tuyển sinh",
            answer: `Website chính thức của trường là ${admissionOverviewData.website}. Trang tuyển sinh là ${admissionOverviewData.admissionWebsite}. Trang đăng ký xét tuyển là ${admissionOverviewData.applicationWebsite}.`,
        };
    }

    if (includesAny(text, ["so dien thoai", "phong dao tao", "hotline"])) {
        return {
            source: "structured_admission_overview",
            title: "Số điện thoại tuyển sinh",
            answer: `Số điện thoại liên hệ tuyển sinh của Phòng Đào tạo là ${admissionOverviewData.phoneNumbers.join(" và ")}.`,
        };
    }

    if (includesAny(text, ["pham vi tuyen sinh", "toan quoc"])) {
        return {
            source: "structured_admission_overview",
            title: "Phạm vi tuyển sinh",
            answer: `Phạm vi tuyển sinh của trường là ${admissionOverviewData.scope.toLowerCase()}.`,
        };
    }

    if (includesAny(text, ["chi tieu tong", "tong chi tieu", "5600"])) {
        return {
            source: "structured_admission_overview",
            title: "Tổng chỉ tiêu",
            answer: `Số lượng dự kiến xét tuyển tất cả các ngành năm 2026 là ${new Intl.NumberFormat("vi-VN").format(admissionOverviewData.totalQuota)} chỉ tiêu.`,
        };
    }

    if (includesAny(text, ["hoc bong"])) {
        return {
            source: "structured_admission_overview",
            title: "Học bổng",
            answer: `Trường có học bổng tuyển sinh và học bổng khuyến khích học tập. Cụ thể: ${admissionOverviewData.scholarships.directAdmission} ${admissionOverviewData.scholarships.firstSemester} ${admissionOverviewData.scholarships.studyEncouragement}`,
        };
    }

    if (includesAny(text, ["le phi", "phi thi", "phi xet tuyen"])) {
        return {
            source: "structured_admission_overview",
            title: "Lệ phí tuyển sinh",
            answer: `Lệ phí dự thi V-SAT là ${admissionOverviewData.admissionFees.vsatMultipleChoice} đối với các môn trắc nghiệm và ${admissionOverviewData.admissionFees.vsatMixed} đối với các môn thi trắc nghiệm và tự luận. Lệ phí thi năng khiếu là ${admissionOverviewData.admissionFees.aptitude}.`,
        };
    }

    if (includesAny(text, ["vsat"])) {
        return {
            source: "structured_admission_overview",
            title: "V-SAT",
            answer: `Thí sinh đăng ký và dự thi V-SAT theo thông báo trên trang ${admissionOverviewData.vsatWebsite} của Trường Đại học Sài Gòn hoặc tại các trường được Bộ GD&ĐT cho phép tổ chức Kì thi V-SAT năm 2026.`,
        };
    }

    return {
        source: "structured_admission_overview",
        title: "Thông tin tuyển sinh chung",
        answer: `${admissionOverviewData.schoolName} có mã trường ${admissionOverviewData.schoolCode}, tuyển sinh ${admissionOverviewData.trainingType.toLowerCase()}, phạm vi ${admissionOverviewData.scope.toLowerCase()}. Website tuyển sinh là ${admissionOverviewData.admissionWebsite}.`,
    };
}

function findMajorByMessage(message) {
    const normalizedMessage = normalizeMessage(message);
    let bestMatch = null;

    for (const item of majorsData) {
        const result = scoreItemByKeywords(message, item.keywords || []);

        if (
            item.admissionCode &&
            normalizedMessage.includes(normalizeText(item.admissionCode))
        ) {
            result.score += 5;
        }

        if (
            item.majorCode &&
            normalizedMessage.includes(normalizeText(item.majorCode))
        ) {
            result.score += 4;
        }

        if (result.score <= 0) continue;

        if (!bestMatch || result.score > bestMatch.score) {
            bestMatch = { item, score: result.score };
        }
    }

    return bestMatch?.item || null;
}

function isMajorQuestion(message) {
    const text = normalizeMessage(message);

    return includesAny(text, [
        "ma xet tuyen",
        "ma nganh",
        "chi tieu",
        "so luong tuyen sinh",
        "pt1",
        "pt2",
        "pt3",
        "pt4",
        "phuong thuc",
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
        return {
            source: "structured_major",
            title: `Mã xét tuyển ${major.programName}`,
            answer: `Mã xét tuyển của chương trình ${major.programName} là ${major.admissionCode}. Mã ngành là ${major.majorCode}.`,
        };
    }

    if (includesAny(text, ["ma nganh"])) {
        return {
            source: "structured_major",
            title: `Mã ngành ${major.programName}`,
            answer: `Mã ngành của ${major.programName} là ${major.majorCode}. Mã xét tuyển là ${major.admissionCode}.`,
        };
    }

    if (includesAny(text, ["chi tieu", "so luong tuyen sinh"])) {
        return {
            source: "structured_major",
            title: `Chỉ tiêu ${major.programName}`,
            answer: `Chương trình ${major.programName} có chỉ tiêu dự kiến năm 2026 là ${major.quota} sinh viên.`,
        };
    }

    if (
        includesAny(text, [
            "phuong thuc",
            "pt1",
            "pt2",
            "pt3",
            "pt4",
            "vsat",
            "dgnl",
            "thpt",
        ])
    ) {
        return {
            source: "structured_major",
            title: `Phương thức xét tuyển ${major.programName}`,
            answer: `Chương trình ${major.programName} áp dụng các phương thức xét tuyển sau: ${methodsText}.`,
        };
    }

    return {
        source: "structured_major",
        title: major.programName,
        answer: `${major.programName} có mã xét tuyển ${major.admissionCode}, mã ngành ${major.majorCode}, chỉ tiêu dự kiến ${major.quota} và áp dụng các phương thức: ${methodsText}.`,
    };
}

function isTuitionQuestion(message) {
    return includesAny(normalizeMessage(message), [
        "hoc phi",
        "toan khoa",
        "chat luong cao",
    ]);
}

function buildTuitionAnswer(message) {
    const major = findMajorByMessage(message);
    const text = normalizeMessage(message);

    let matchedItem = null;
    let bestScore = 0;

    for (const item of tuitionData) {
        let score = scoreItemByKeywords(message, item.majors || []).score;

        if (major && includesAny(normalizeText(major.programName), item.majors || [])) {
            score += 5;
        }

        if (text.includes("chat luong cao") && item.type === "high_quality") {
            score += 3;
        }

        if (score > bestScore) {
            matchedItem = item;
            bestScore = score;
        }
    }

    if (!matchedItem || bestScore <= 0) return null;

    const subjectText =
        major?.programName || matchedItem.groupTitle || "nhóm ngành tương ứng";

    return {
        source: "structured_tuition",
        title: `Học phí ${subjectText}`,
        answer: `Học phí dự kiến của ${subjectText} trong kỳ tuyển sinh đại học chính quy năm 2026 là ${matchedItem.displayFee} cho toàn khóa.`,
    };
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
        return {
            source: "structured_combination",
            title: `Tổ hợp xét tuyển ${major.programName}`,
            answer: `Mình đã nhận diện bạn đang hỏi về chương trình ${major.programName}. Để xem chính xác các tổ hợp môn xét tuyển, hệ số môn và công thức tính điểm của chương trình này, bạn mở Phụ lục tổ hợp môn xét tuyển đi kèm bên dưới nhé.`,
        };
    }

    return {
        source: "structured_combination",
        title: "Tổ hợp môn xét tuyển",
        answer:
            "Thông tin tổ hợp môn, hệ số môn và công thức tính điểm được công bố trong Phụ lục tổ hợp môn xét tuyển. Bạn có thể hỏi rõ theo ngành, ví dụ: “Công nghệ thông tin xét tổ hợp nào?” hoặc mở file PDF liên quan bên dưới để xem đầy đủ.",
    };
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
        return {
            source: "structured_aptitude_exam",
            title: "Thi năng khiếu Sư phạm Âm nhạc",
            answer:
                "Bạn đang hỏi về ngành Sư phạm Âm nhạc. Nội dung thi năng khiếu của ngành này nằm trong quyết định ban hành nội dung thi năng khiếu năm 2026. Bạn hãy mở file PDF liên quan bên dưới để xem đầy đủ phần xướng âm, thẩm âm và các yêu cầu cụ thể.",
        };
    }

    if (includesAny(text, ["su pham my thuat", "hinh hoa", "trang tri"])) {
        return {
            source: "structured_aptitude_exam",
            title: "Thi năng khiếu Sư phạm Mỹ thuật",
            answer:
                "Bạn đang hỏi về ngành Sư phạm Mỹ thuật. Nội dung thi năng khiếu của ngành này được công bố trong quyết định ban hành nội dung thi năng khiếu năm 2026. Bạn mở file PDF liên quan bên dưới để xem chính xác phần hình họa, trang trí và thời gian làm bài.",
        };
    }

    if (includesAny(text, ["giao duc mam non", "ke chuyen", "hat"])) {
        return {
            source: "structured_aptitude_exam",
            title: "Thi năng khiếu Giáo dục Mầm non",
            answer:
                "Bạn đang hỏi về ngành Giáo dục Mầm non. Nội dung thi năng khiếu được công bố trong quyết định ban hành nội dung thi năng khiếu năm 2026. Bạn mở file PDF liên quan bên dưới để xem chính xác phần kể chuyện, hát và yêu cầu chấm thi.",
        };
    }

    return {
        source: "structured_aptitude_exam",
        title: "Kỳ thi năng khiếu",
        answer:
            "Thông tin chi tiết về nội dung thi năng khiếu năm 2026 được công bố trong quyết định ban hành nội dung thi năng khiếu. Bạn có thể hỏi rõ theo ngành như Sư phạm Âm nhạc, Sư phạm Mỹ thuật hoặc Giáo dục Mầm non để mình định hướng nhanh hơn, đồng thời mở file PDF liên quan bên dưới để xem đầy đủ.",
    };
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
    return rules.find(
        (rule) => scoreValue >= rule.min && scoreValue <= rule.max
    );
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
        return {
            source: "structured_english_certificate",
            title: englishCertificateGeneralInfo.title,
            answer: `${englishCertificateGeneralInfo.answer} ${englishCertificateGeneralInfo.note}`,
        };
    }

    const rules = englishCertificateRules[certificate.type] || [];

    if (scoreValue === null) {
        return {
            source: "structured_english_certificate",
            title: `Quy đổi ${certificate.label}`,
            answer: `Trường có áp dụng quy đổi cho ${certificate.label}. Bạn hãy hỏi kèm mức điểm cụ thể, ví dụ: “IELTS 5.5 quy đổi bao nhiêu?” hoặc “TOEFL iBT 70 được mấy điểm?”.`,
        };
    }

    const matchedRule = findCertificateRule(rules, scoreValue);

    if (!matchedRule) {
        return {
            source: "structured_english_certificate",
            title: `Quy đổi ${certificate.label}`,
            answer: `Mình chưa tìm thấy mức quy đổi phù hợp cho ${certificate.label} ${scoreValue} trong dữ liệu hiện tại. Bạn nên kiểm tra lại mức điểm hoặc xem thêm phụ lục quy đổi chứng chỉ tiếng Anh năm 2026.`,
        };
    }

    return {
        source: "structured_english_certificate",
        title: `Quy đổi ${certificate.label}`,
        answer: `${certificate.label} ${scoreValue} được quy đổi thành ${matchedRule.convertedScore} điểm môn Tiếng Anh và được cộng ${matchedRule.bonusScore} điểm khuyến khích.`,
    };
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
        return {
            source: "structured_direct_admission",
            title: directAdmissionGeneralInfo.title,
            answer: directAdmissionGeneralInfo.answer,
        };
    }

    const directItem = directAdmissionData.find(
        (item) => item.admissionCode === major.admissionCode
    );

    if (!directItem) return null;

    if (directItem.notApplicable) {
        return {
            source: "structured_direct_admission",
            title: `Xét tuyển thẳng ${directItem.programName}`,
            answer: `Chương trình ${directItem.programName} hiện không áp dụng xét tuyển thẳng theo môn thi học sinh giỏi hoặc giải thưởng phù hợp trong Phụ lục 4.`,
        };
    }

    return {
        source: "structured_direct_admission",
        title: `Xét tuyển thẳng ${directItem.programName}`,
        answer: `Chương trình ${directItem.programName} có thể đăng ký xét tuyển thẳng theo các môn thi học sinh giỏi hoặc giải thưởng phù hợp sau: ${directItem.eligibleSubjects.join(", ")}.`,
    };
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
        return {
            source: "structured_reward_bonus",
            title: rewardBonusGeneralInfo.title,
            answer: `${rewardBonusGeneralInfo.answer} ${rewardBonusGeneralInfo.note}`,
        };
    }

    const isPT2 = text.includes("pt2") || text.includes("phuong thuc 2");
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

    const rules = rewardBonusRules[bonusType.type];

    if (!rank) {
        return {
            source: "structured_reward_bonus",
            title: rewardBonusGeneralInfo.title,
            answer: `${rewardBonusGeneralInfo.answer} ${rewardBonusGeneralInfo.note}`,
        };
    }

    if (bonusType.type === "nationalInternational") {
        if (isPT2) {
            const value = rules.PT2.subjectNotInCombination[rank];
            return {
                source: "structured_reward_bonus",
                title: `Điểm thưởng ${bonusType.label}`,
                answer:
                    value === null
                        ? `Với ${bonusType.label.toLowerCase()} ở phương thức 2, ${rank.toLowerCase()} không áp dụng điểm thưởng hoặc điểm xét thưởng.`
                        : `Với ${bonusType.label.toLowerCase()} ở phương thức 2, ${rank.toLowerCase()} được cộng ${value} điểm theo thang điểm 30.`,
            };
        }

        if (notInCombination) {
            const value = rules.PT3_PT4.subjectNotInCombination[rank];
            return {
                source: "structured_reward_bonus",
                title: `Điểm thưởng ${bonusType.label}`,
                answer:
                    value === null
                        ? `Với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải không thuộc tổ hợp xét tuyển thì ${rank.toLowerCase()} không được áp dụng.`
                        : `Với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải không thuộc tổ hợp xét tuyển thì ${rank.toLowerCase()} được cộng ${value} điểm theo thang điểm 30.`,
            };
        }

        const value = rules.PT3_PT4.subjectInCombination[rank];
        return {
            source: "structured_reward_bonus",
            title: `Điểm thưởng ${bonusType.label}`,
            answer: `Với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải thuộc tổ hợp xét tuyển thì ${rank.toLowerCase()} được cộng ${value} điểm theo thang điểm 30.`,
        };
    }

    if (bonusType.type === "provincialCity") {
        if (isPT2) {
            return {
                source: "structured_reward_bonus",
                title: `Điểm thưởng ${bonusType.label}`,
                answer: `Đối với ${bonusType.label.toLowerCase()}, phương thức 2 không áp dụng điểm thưởng hoặc điểm xét thưởng.`,
            };
        }

        if (notInCombination) {
            return {
                source: "structured_reward_bonus",
                title: `Điểm thưởng ${bonusType.label}`,
                answer: `Đối với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải không thuộc tổ hợp xét tuyển thì không áp dụng điểm thưởng hoặc điểm xét thưởng.`,
            };
        }

        const value = rules.PT3_PT4.subjectInCombination[rank];
        return {
            source: "structured_reward_bonus",
            title: `Điểm thưởng ${bonusType.label}`,
            answer:
                value === null
                    ? `Đối với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, ${rank.toLowerCase()} không áp dụng điểm thưởng hoặc điểm xét thưởng.`
                    : `Đối với ${bonusType.label.toLowerCase()} ở phương thức 3 hoặc 4, nếu môn đạt giải thuộc tổ hợp xét tuyển thì ${rank.toLowerCase()} được cộng ${value} điểm theo thang điểm 30.`,
        };
    }

    return null;
}

function chooseHigherPriorityResult(...results) {
    return results.find(Boolean) || null;
}

export function getChatbotResponse(message) {
    const relatedDocument = findRelatedDocument(message);

    if (isGreeting(message)) {
        const greetingResult = buildGreetingAnswer();
        return {
            source: greetingResult.source,
            answer: greetingResult.answer,
            title: greetingResult.title || null,
            document: relatedDocument,
        };
    }

    const structuredResult = chooseHigherPriorityResult(
        isEnglishCertificateQuestion(message)
            ? buildEnglishCertificateAnswer(message)
            : null,
        isTuitionQuestion(message) ? buildTuitionAnswer(message) : null,
        isDirectAdmissionQuestion(message)
            ? buildDirectAdmissionAnswer(message)
            : null,
        isRewardBonusQuestion(message) ? buildRewardBonusAnswer(message) : null,
        isAptitudeQuestion(message) ? buildAptitudeAnswer(message) : null,
        isCombinationQuestion(message) ? buildCombinationAnswer(message) : null,
        isAdmissionOverviewQuestion(message)
            ? buildAdmissionOverviewAnswer(message)
            : null,
        isMajorQuestion(message) ? buildMajorAnswer(message) : null
    );

    if (structuredResult) {
        return {
            source: structuredResult.source,
            answer: structuredResult.answer,
            title: structuredResult.title || null,
            document: relatedDocument,
        };
    }

    const faqResult = findFaqAnswer(message);
    const knowledgeResult = findKnowledgeAnswer(message);

    let baseResult = buildFallbackAnswer();

    if (faqResult && knowledgeResult) {
        baseResult =
            faqResult.score >= knowledgeResult.score
                ? faqResult
                : knowledgeResult;
    } else if (faqResult) {
        baseResult = faqResult;
    } else if (knowledgeResult) {
        baseResult = knowledgeResult;
    }

    return {
        source: baseResult.source,
        answer: baseResult.answer,
        title: baseResult.title || null,
        document: relatedDocument,
    };

function isAdmissionMethodQuestion(message) {
    const text = normalizeMessage(message);

    return includesAny(text, [
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

function buildAdmissionMethodsGeneralAnswer() {
    const methodsText = Object.entries(admissionMethodsMap)
        .map(([code, label]) => `${code}: ${label}`)
        .join("; ");

    return {
        source: "structured_admission_methods_general",
        title: "Các phương thức xét tuyển",
        answer: `Năm 2026, Trường Đại học Sài Gòn áp dụng các phương thức xét tuyển sau: ${methodsText}.`,
    };
}

}