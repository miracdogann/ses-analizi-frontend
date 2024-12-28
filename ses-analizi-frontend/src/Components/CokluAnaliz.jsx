// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navigation from './Navigation';

// function CokluAnaliz() {
//   const navigate = useNavigate();
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);

//   // Kullanıcı verisini al
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem('user'));

//     if (!user) {
//       console.log('Oturum açılmamış');
//       navigate('/loginPage');
//     }
//   }, [navigate]);

//   // Ses kaydını başlat
//   const startRecording = async () => {
//     // Yeni kayda başlamadan önce önceki kaydın sıfırlanması
//     setAudioBlob(null); // Eski kaydı temizle
//     audioChunksRef.current = []; // Eski veriyi temizle

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

//     mediaRecorderRef.current.ondataavailable = (event) => {
//       audioChunksRef.current.push(event.data);
//     };

//     mediaRecorderRef.current.onstop = () => {
//       const audioBlobData = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//       setAudioBlob(audioBlobData);

//       // Backend'e ses dosyasını gönder
//       const formData = new FormData();
//       formData.append('audio', audioBlobData, 'recording.webm');

//       fetch('http://127.0.0.1:8000/api/coklu-analiz/', {
//         method: 'POST',
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((data) => console.log('Backend response:', data))
//         .catch((error) => console.error('Error uploading audio:', error));
//     };

//     mediaRecorderRef.current.start();
//     setIsRecording(true);
//   };

//   // Ses kaydını durdur
//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setIsRecording(false);
//   };

//   return (
//     <>
//       <Navigation />
//       <div style={{ textAlign: 'center', marginTop: '20px' }}>
//         <h2>Ses Kaydedici</h2>
//         <div>
//           <button onClick={isRecording ? stopRecording : startRecording}>
//             {isRecording ? 'Kaydı Durdur' : 'Kaydı Başlat'}
//           </button>
//         </div>
//         {audioBlob && (
//           <div>
//             <h3>Kaydedilen Ses</h3>
//             <audio controls>
//               <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
//             </audio>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default CokluAnaliz;
