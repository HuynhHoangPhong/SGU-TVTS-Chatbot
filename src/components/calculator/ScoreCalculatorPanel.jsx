import { useMemo, useRef, useState } from "react";

const COMBINATION_SUBJECTS = {
    A00: ["Toán", "Vật lý", "Hóa học"],
    A01: ["Toán", "Vật lý", "Tiếng Anh"],
    B00: ["Toán", "Hóa học", "Sinh học"],
    C00: ["Ngữ văn", "Lịch sử", "Địa lí"],
    C01: ["Ngữ văn", "Toán", "Vật lý"],
    D01: ["Toán", "Ngữ văn", "Tiếng Anh"],
    D07: ["Toán", "Hóa học", "Tiếng Anh"],
};

const SUBJECT_KEYS = {
    "Toán": "toan",
    "Ngữ văn": "van",
    "Tiếng Anh": "anh",
    "Vật lý": "ly",
    "Hóa học": "hoa",
    "Sinh học": "sinh",
    "Lịch sử": "su",
    "Địa lí": "dia",
};

const COMBINATION_DIFF = {
    A00: { A00: 0, A01: -0.69, B00: -1.21, C00: 2.32, C01: 0.94, D01: -0.68, D07: -1.62 },
    A01: { A00: 0.69, A01: 0, B00: -0.52, C00: 3.01, C01: 1.63, D01: 0.01, D07: -0.93 },
    B00: { A00: 1.21, A01: 0.52, B00: 0, C00: 3.53, C01: 2.15, D01: 0.53, D07: -0.41 },
    C00: { A00: -2.32, A01: -3.01, B00: -3.53, C00: 0, C01: -1.38, D01: -3.0, D07: -3.94 },
    C01: { A00: -0.94, A01: -1.63, B00: -2.15, C00: 1.38, C01: 0, D01: -1.62, D07: -2.56 },
    D01: { A00: 0.68, A01: -0.01, B00: -0.53, C00: 3.0, C01: 1.62, D01: 0, D07: -0.94 },
    D07: { A00: 1.62, A01: 0.93, B00: 0.41, C00: 3.94, C01: 2.56, D01: 0.94, D07: 0 },
};

function roundNumber(value, digits = 2) {
    return Number(value.toFixed(digits));
}

function parseScore(value) {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(String(value).replace(",", "."));
    return Number.isNaN(parsed) ? null : parsed;
}

function clampScore(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function calculateWeightedTotal(subjectScores, subjectWeights) {
    const totalWeight = subjectWeights.reduce((sum, item) => sum + item, 0);

    if (!totalWeight) return 0;

    const weightedAverage =
        subjectScores.reduce((sum, score, index) => {
            return sum + score * subjectWeights[index];
        }, 0) / totalWeight;

    return weightedAverage * 3;
}

function getPriorityScore(baseConvertedScore, bonusScore, priorityBaseScore) {
    if (baseConvertedScore + bonusScore < 22.5) {
        return priorityBaseScore;
    }

    return ((30 - baseConvertedScore - bonusScore) / 7.5) * priorityBaseScore;
}

export default function ScoreCalculatorPanel() {
    const [sourceCombination, setSourceCombination] = useState("D01");
    const [rootCombination, setRootCombination] = useState("D01");

    const [scores, setScores] = useState({
        toan: "",
        van: "",
        anh: "",
        ly: "",
        hoa: "",
        sinh: "",
        su: "",
        dia: "",
    });

    const [weights, setWeights] = useState({
        subject1: 1,
        subject2: 1,
        subject3: 1,
    });

    const [bonusScore, setBonusScore] = useState("");
    const [priorityBaseScore, setPriorityBaseScore] = useState("");
    const [formError, setFormError] = useState("");
    const [result, setResult] = useState(null);

    const inputRefs = {
        toan: useRef(null),
        van: useRef(null),
        anh: useRef(null),
        ly: useRef(null),
        hoa: useRef(null),
        sinh: useRef(null),
        su: useRef(null),
        dia: useRef(null),
        bonusScore: useRef(null),
        priorityBaseScore: useRef(null),
    };

    const sourceSubjects = useMemo(
        () => COMBINATION_SUBJECTS[sourceCombination] || [],
        [sourceCombination]
    );

    const handleScoreChange = (key, value) => {
        let nextValue = value.replace(",", ".");

        if (nextValue === "") {
            setScores((prev) => ({
                ...prev,
                [key]: "",
            }));
            return;
        }

        let parsed = Number(nextValue);
        if (Number.isNaN(parsed)) return;

        parsed = clampScore(parsed, 0, 10);

        setScores((prev) => ({
            ...prev,
            [key]: String(parsed),
        }));
    };

    const handleWeightChange = (key, value) => {
        if (value === "") {
            setWeights((prev) => ({
                ...prev,
                [key]: "",
            }));
            return;
        }

        let parsed = Number(value);
        if (Number.isNaN(parsed)) return;

        if (parsed < 1) parsed = 1;

        setWeights((prev) => ({
            ...prev,
            [key]: String(Math.floor(parsed)),
        }));
    };

    const focusField = (key) => {
        const ref = inputRefs[key];
        if (ref?.current) {
            ref.current.focus();
        }
    };

    const validateBeforeCalculate = () => {
        for (const subject of sourceSubjects) {
            const key = SUBJECT_KEYS[subject];
            const parsed = parseScore(scores[key]);

            if (scores[key] === "") {
                setFormError(`Bạn chưa nhập điểm môn ${subject}.`);
                focusField(key);
                return null;
            }

            if (parsed === null || parsed < 0 || parsed > 10) {
                setFormError(`Điểm môn ${subject} phải từ 0 đến 10.`);
                focusField(key);
                return null;
            }
        }

        const weightList = [
            { key: "subject1", label: `hệ số môn ${sourceSubjects[0]}` },
            { key: "subject2", label: `hệ số môn ${sourceSubjects[1]}` },
            { key: "subject3", label: `hệ số môn ${sourceSubjects[2]}` },
        ];

        for (const item of weightList) {
            const value = Number(weights[item.key]);
            if (!value || value < 1) {
                setFormError(`Bạn cần nhập ${item.label} hợp lệ.`);
                return null;
            }
        }

        if (bonusScore !== "") {
            const parsedBonus = parseScore(bonusScore);
            if (parsedBonus === null || parsedBonus < 0) {
                setFormError("Điểm cộng không được âm.");
                focusField("bonusScore");
                return null;
            }
        }

        if (priorityBaseScore !== "") {
            const parsedPriority = parseScore(priorityBaseScore);
            if (parsedPriority === null || parsedPriority < 0) {
                setFormError("Mức điểm ưu tiên không được âm.");
                focusField("priorityBaseScore");
                return null;
            }
        }

        setFormError("");
        return true;
    };

    const handleCalculate = () => {
        const isValid = validateBeforeCalculate();
        if (!isValid) {
            setResult(null);
            return;
        }

        const subjectKeys = sourceSubjects.map((subject) => SUBJECT_KEYS[subject]);
        const subjectScores = subjectKeys.map((key) => parseScore(scores[key]));
        const subjectWeights = [
            Number(weights.subject1) || 1,
            Number(weights.subject2) || 1,
            Number(weights.subject3) || 1,
        ];

        const dthxt = calculateWeightedTotal(subjectScores, subjectWeights);
        const diffValue = COMBINATION_DIFF[rootCombination]?.[sourceCombination] ?? 0;

        let dthgxt = dthxt - diffValue;
        if (dthgxt < 0) dthgxt = 0;

        let effectiveBonus = bonusScore === "" ? 0 : parseScore(bonusScore);
        if (effectiveBonus > 3) effectiveBonus = 3;
        if (effectiveBonus < 0) effectiveBonus = 0;

        let priorityBase = priorityBaseScore === "" ? 0 : parseScore(priorityBaseScore);
        if (priorityBase < 0) priorityBase = 0;

        let dut =
            priorityBase > 0
                ? getPriorityScore(dthgxt, effectiveBonus, priorityBase)
                : 0;

        if (dut < 0) dut = 0;

        let finalScore = dthgxt + effectiveBonus + dut;
        if (finalScore > 30) finalScore = 30;
        if (finalScore < 0) finalScore = 0;

        setResult({
            dthxt: roundNumber(Math.max(dthxt, 0)),
            diffValue: roundNumber(diffValue),
            dthgxt: roundNumber(dthgxt),
            bonusScore: roundNumber(effectiveBonus),
            dut: roundNumber(dut),
            finalScore: roundNumber(finalScore),
        });
    };

    const resetForm = () => {
        setSourceCombination("D01");
        setRootCombination("D01");
        setScores({
            toan: "",
            van: "",
            anh: "",
            ly: "",
            hoa: "",
            sinh: "",
            su: "",
            dia: "",
        });
        setWeights({
            subject1: 1,
            subject2: 1,
            subject3: 1,
        });
        setBonusScore("");
        setPriorityBaseScore("");
        setFormError("");
        setResult(null);
    };

    return (
        <div className="score-tool-card fade-in-up">
            <div className="score-tool-header">
                <div>
                    <p className="score-tool-badge">CÔNG CỤ HỖ TRỢ</p>
                    <h4>Công cụ tính điểm xét tuyển SGU</h4>
                    <p className="score-tool-note">
                        Hỗ trợ tính điểm theo phương thức THPT, quy đổi tổ hợp,
                        điểm cộng, điểm ưu tiên và điểm xét tuyển cuối cùng.
                    </p>
                </div>
            </div>

            <div className="score-tool-grid">
                <div className="score-tool-section">
                    <h5>1. Chọn tổ hợp</h5>

                    <label className="score-label">Tổ hợp hiện tại</label>
                    <select
                        className="form-select score-select"
                        value={sourceCombination}
                        onChange={(event) => {
                            setSourceCombination(event.target.value);
                            setFormError("");
                            setResult(null);
                        }}
                    >
                        {Object.keys(COMBINATION_SUBJECTS).map((combination) => (
                            <option key={combination} value={combination}>
                                {combination} - {COMBINATION_SUBJECTS[combination].join(" - ")}
                            </option>
                        ))}
                    </select>

                    <label className="score-label mt-3">Tổ hợp gốc của ngành</label>
                    <select
                        className="form-select score-select"
                        value={rootCombination}
                        onChange={(event) => {
                            setRootCombination(event.target.value);
                            setFormError("");
                            setResult(null);
                        }}
                    >
                        {Object.keys(COMBINATION_SUBJECTS).map((combination) => (
                            <option key={combination} value={combination}>
                                {combination}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="score-tool-section">
                    <h5>2. Nhập điểm từng môn</h5>

                    <div className="score-subject-list">
                        {sourceSubjects.map((subject, index) => {
                            const key = SUBJECT_KEYS[subject];
                            const weightKey = `subject${index + 1}`;

                            return (
                                <div className="score-subject-row" key={subject}>
                                    <div className="score-subject-name">
                                        <strong>{subject}</strong>
                                    </div>

                                    <div className="score-input-group">
                                        <label className="score-label small-label">Điểm</label>
                                        <input
                                            ref={inputRefs[key]}
                                            type="number"
                                            min="0"
                                            max="10"
                                            step="0.01"
                                            className="form-control score-input"
                                            value={scores[key]}
                                            onChange={(event) =>
                                                handleScoreChange(key, event.target.value)
                                            }
                                            placeholder="0 - 10"
                                        />
                                    </div>

                                    <div className="score-input-group weight-input-group">
                                        <label className="score-label small-label">Hệ số</label>
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            className="form-control score-input"
                                            value={weights[weightKey]}
                                            onChange={(event) =>
                                                handleWeightChange(weightKey, event.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="score-tool-section">
                    <h5>3. Điểm cộng và ưu tiên</h5>

                    <label className="score-label">Điểm cộng (ĐC, tối đa 3)</label>
                    <input
                        ref={inputRefs.bonusScore}
                        type="number"
                        min="0"
                        max="3"
                        step="0.01"
                        className="form-control score-input"
                        value={bonusScore}
                        onChange={(event) => {
                            let value = event.target.value.replace(",", ".");
                            if (value === "") {
                                setBonusScore("");
                                return;
                            }

                            let parsed = Number(value);
                            if (Number.isNaN(parsed)) return;
                            parsed = clampScore(parsed, 0, 3);
                            setBonusScore(String(parsed));
                        }}
                        placeholder="Ví dụ 1.25"
                    />

                    <div className="mt-3">
                        <label className="score-label">
                            Mức điểm ưu tiên gốc (MĐƯT)
                        </label>
                        <input
                            ref={inputRefs.priorityBaseScore}
                            type="number"
                            min="0"
                            step="0.01"
                            className="form-control score-input"
                            value={priorityBaseScore}
                            onChange={(event) => {
                                let value = event.target.value.replace(",", ".");
                                if (value === "") {
                                    setPriorityBaseScore("");
                                    return;
                                }

                                let parsed = Number(value);
                                if (Number.isNaN(parsed)) return;
                                if (parsed < 0) parsed = 0;
                                setPriorityBaseScore(String(parsed));
                            }}
                            placeholder="Ví dụ 0.75 hoặc 1"
                        />
                    </div>

                    <p className="score-hint mt-3">
                        Nếu bỏ trống điểm cộng hoặc mức ưu tiên thì hệ thống tự hiểu là 0.
                    </p>
                </div>

                <div className="score-tool-section score-result-section">
                    <h5>4. Kết quả tính điểm</h5>

                    {formError && <div className="score-error-box">{formError}</div>}

                    {result && (
                        <>
                            <div className="score-result-list mt-3">
                                <div className="score-result-item">
                                    <span>ĐTHXT</span>
                                    <strong>{result.dthxt}</strong>
                                </div>

                                <div className="score-result-item">
                                    <span>Mức chênh lệch quy đổi</span>
                                    <strong>{result.diffValue}</strong>
                                </div>

                                <div className="score-result-item">
                                    <span>ĐTHGXT</span>
                                    <strong>{result.dthgxt}</strong>
                                </div>

                                <div className="score-result-item">
                                    <span>ĐC</span>
                                    <strong>{result.bonusScore}</strong>
                                </div>

                                <div className="score-result-item">
                                    <span>ĐƯT</span>
                                    <strong>{result.dut}</strong>
                                </div>

                                <div className="score-result-item final-score-item">
                                    <span>ĐXT cuối cùng</span>
                                    <strong>{result.finalScore}</strong>
                                </div>
                            </div>

                            <div className="score-explain-box">
                                <p>
                                    <strong>Cách hiểu nhanh:</strong>
                                </p>
                                <p>
                                    ĐTHXT được tính từ tổ hợp <strong>{sourceCombination}</strong>,
                                    sau đó quy đổi về tổ hợp gốc <strong>{rootCombination}</strong>.
                                </p>
                                <p>
                                    Công thức cuối cùng:
                                    <br />
                                    <strong>ĐXT = ĐTHGXT + ĐC + ĐƯT</strong>
                                </p>
                            </div>
                        </>
                    )}

                    <div className="score-tool-actions">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={resetForm}
                        >
                            Nhập lại
                        </button>

                        <button
                            type="button"
                            className="btn send-btn"
                            onClick={handleCalculate}
                        >
                            Tính điểm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
