import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import "../styles/css/sesAnalizi.css";
import Grafikler from "./Grafikler";
import Modal from "./Modal"; // Modal'ı import ediyoruz

function SesAnalizi() {
    const [audioList, setAudioList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [analyzeCount, setAnalyzeCount] = useState(0); // Analiz sayısını takip eden state
    const [isLoading, setIsLoading] = useState(false); // Yüklenme durumunu takip eden state
    const [modalMessage, setModalMessage] = useState(""); // Modal mesajı
    const [showModal, setShowModal] = useState(false); // Modal'ı gösterme durumu
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/");
        } else {
            fetchAudioList();
        }
    }, [navigate]);

    const fetchAudioList = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/list_audio_files/${user.id}/`);
            const data = await response.json();
            if (response.ok) {
                setAudioList(data.audio_files);
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Ses kayıtları yüklenirken hata oluştu:", err);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            alert("Lütfen bir ses kaydı seçin!");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const data = { file_path: selectedFile.file_path };

        setIsLoading(true); // Yüklenme başlatılıyor
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/analyze_audio/${user.id}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            console.log("userrrr **** "+result.user_info['Ad_Soyad'])

            if (response.ok) {
                console.log("API Yanıtı: ", result);  // API yanıtını kontrol edelim
                
                setModalMessage(
                    `Tahmin Edilen Kişi: ${result.user_info['Ad_Soyad']}\nOturum Açmış Kullanıcı: ${user.name} ${user.surname}`
                );
                setShowModal(true); // Modal'ı göster
                setAnalyzeCount((prevCount) => prevCount + 1); // Analiz sayısını artır
            } else {
                setModalMessage("Hata: " + result.error);
                setShowModal(true);
            }
        } catch (err) {
            console.error("Ses kaydı gönderilirken hata oluştu:", err);
            setModalMessage("Bir hata oluştu, lütfen tekrar deneyin.");
            setShowModal(true);
        } finally {
            setIsLoading(false); // Yüklenme tamamlandı
        }
    };

    const closeModal = () => {
        setShowModal(false); // Modal'ı kapat
    };

    return (
        <>
            <Navigation />
            <div id="sesAnaliziContainer">
                <h2>SES ANALİZİ</h2>
                <div>
                    <h3>Ses Kayıtları</h3>
                    {audioList.length > 0 ? (
                        <ul>
                            {audioList.map((audio, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="audio"
                                            value={audio.file_path}
                                            onChange={() => setSelectedFile(audio)}
                                        />
                                        {audio.file_name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Henüz yüklenmiş bir ses kaydı bulunmuyor.</p>
                    )}
                </div>

                <button onClick={handleAnalyze} disabled={!selectedFile || isLoading}>
                    {isLoading ? "Yükleniyor..." : "Seçili Dosyayı Analiz Et"}
                </button>

                {isLoading && (
                    <div className="loading-bar">
                        <div className="loading-progress"></div>
                    </div>
                )}
            </div>
            <Grafikler analyzeCount={analyzeCount} /> {/* analyzeCount prop olarak geçiliyor */}

            {showModal && <Modal message={modalMessage} onClose={closeModal} />} {/* Modal'ı göster */}
        </>
    );
}

export default SesAnalizi;
