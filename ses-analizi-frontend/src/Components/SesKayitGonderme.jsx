import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";


import "../styles/css/sesKayitGonderme.css";

function SesKayitGonderme() {
    const [isRecording, setIsRecording] = useState(false);
    const [audio, setAudio] = useState(null);
    const [lastAudioHash, setLastAudioHash] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false); // Kayıt gönderildikten sonra etkinleştirilir
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const navigate = useNavigate();


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            // Kullanıcı oturum açmamışsa anasayfaya yönlendir
            navigate('/');
        }
    }, [navigate]); // navigate yalnızca component mount olduğunda çalışacak



    const calculateHash = async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
    };

    const startRecording = async () => {
        if (audio) {
            alert("Zaten bir kayıt var. Yeni kayıt almak için önce mevcut kaydı silin.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                const audioUrl = URL.createObjectURL(audioBlob);

                setAudio({ id: Date.now(), url: audioUrl, blob: audioBlob });
                setIsUploaded(false); // Kayıt gönderilmediğinde analiz butonu görünmez
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mikrofona erişim izni verilmedi veya hata oluştu:", err);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    const deleteRecording = () => {
        setAudio(null);
        setIsUploaded(false); // Kayıt silindiğinde analiz butonu devre dışı bırakılır
    };

    const sendAudio = async () => {
        if (!audio || !audio.blob) {
            alert("Gönderilecek bir kayıt bulunmuyor.");
            return;
        }

        const currentAudioHash = await calculateHash(audio.blob);

        if (currentAudioHash === lastAudioHash) {
            alert("Bu kayıt daha önce gönderildi. Aynı kaydı tekrar gönderemezsiniz.");
            return;
        }

        const getUserData = () => {
            const userData = localStorage.getItem("user");
            if (userData) {
                return JSON.parse(userData);
            }
            return null;
        };

        const user = getUserData();
        if (!user) {
            alert("Kullanıcı oturum açmamış.");
            return;
        }

        const formData = new FormData();
        formData.append("audio", audio.blob, "kayit.wav");
        formData.append("user_id", user.id);
        // console.log('audio' , audio)
        // console.log('user',user)

        try {
            const response = await fetch("http://127.0.0.1:8000/api/upload_audio/", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Kayıt Durumu: ${result.message}`);
                setLastAudioHash(currentAudioHash);
                setIsUploaded(true); // Kayıt gönderildiğinde analiz butonu aktif olur
            } else {
                alert(`Hata: ${result.error || "Bilinmeyen hata"}`);
            }
        } catch (err) {
            console.error("Ses analizi gönderiminde hata:", err);
            alert("Sunucuya bağlanırken bir hata oluştu.");
        }
    };

    return (

        <>
            <Navigation />
            <div id="sesKayitGonderme">
                <h2>Ses Kayıt Gönderme</h2>
                <div>
                    {!isRecording ? (
                        <button onClick={startRecording}>Kaydı Başlat</button>
                    ) : (
                        <button onClick={stopRecording}>Kaydı Durdur</button>
                    )}
                    <button onClick={deleteRecording} disabled={!audio}>
                        Kaydı Sil
                    </button>
                    <button onClick={sendAudio} disabled={!audio}>
                        Kaydı Gönder
                    </button>
                </div>

                <div>
                    <h3>Kayıt:</h3>
                    {audio ? (
                        <div>
                            <audio controls src={audio.url}></audio>
                            
                        </div>
                    ) : (
                        <p>Henüz kayıt yapılmadı.</p>
                    )}
                </div>

                {isUploaded && (
                    <div>
                        <button onClick={() => navigate("/homePage/sesAnalizi")}>
                            Kayıtları Analiz Et
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default SesKayitGonderme;
