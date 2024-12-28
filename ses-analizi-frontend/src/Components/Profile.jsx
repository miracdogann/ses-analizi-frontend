import React from 'react'
import Navigation from './Navigation'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/css/profile.css"
function Profile() {
    const navigate = useNavigate('');
    const userData = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        if (userData) {
            console.log(typeof userData)
            // console.log(userData.name)
        }
        else {
            console.log('oturum açılmamış')
            navigate('/loginPage')
        }
    })

    return (
        <>
            <Navigation />
            <div className="profile-container">
                <h2>Kullanıcı Profili</h2>
                <div className="profile-info">
                    <div>İD : {userData.id}</div>
                    <div>Ad : {userData.name}</div>
                    <div>Soyad : {userData.surname}</div>
                    <div>Mail Adresi: {userData.email}</div>
                </div>
            </div>

        </>
    )
}

export default Profile
