import { BrowserRouter as Router, Routes, Route, Link, useNavigate  } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { handleChange, handleSubmit } from "../../js/formUtils";

const LoginPage = () => {
    const navigate = useNavigate();

    const [isMessageOn, setIsMessageOn] = useState(false);
    const [message, SetMessage] = useState(null);
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
    });

    useEffect(() => {
        return () => {
            SetMessage(null);
            setIsMessageOn(false);
            setFormData({
                userId: '',
                password: '',
            });
        };
    }, []);

    useEffect(() => {
        console.log(formData);
    }, [message, formData]);

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit({
                    userId: formData.userId,
                    password: formData.password,
                }, "userData", "read", (resData) => {
                    if (resData.success){
                        console.log(resData.data);
                        // 로그인 set 저장
                        navigate('/');
                    }else{
                        SetMessage(resData.data.message);
                        setIsMessageOn(true);
                        setFormData({
                            userId: '',
                            password: '',
                        });
                    }
                }
            )}>
                <input id="userId" value={formData.userId} name="userId" onChange={handleChange(setFormData)} required/>
                <input id="password" type="password" value={formData.password} name="password" onChange={handleChange(setFormData)} required/>
                <button type="submit">로그인</button>
            </form>
            {isMessageOn && (
                <p>{message}</p>
            )}
        </div>
    )
}

export default LoginPage;