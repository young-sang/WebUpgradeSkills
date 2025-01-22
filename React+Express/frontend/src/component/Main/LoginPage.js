import { BrowserRouter as Router, Routes, Route, Link  } from "react-router-dom";
import React, { useState } from 'react';
import { handleChange, handleSubmit } from "../../js/formUtils";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
    })

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit({
                    userId: formData.userId,
                    password: formData.password,
                }, "userData", "read", (newData, resData) => {
                    if (resData.success === true){
                        console.log(resData.data);
                    }else{
                        alert(resData.data.message);
                    }
                }
            )}>
                <input id="userId" name="userId" onChange={handleChange(setFormData)} required/>
                <input id="password" type="password" name="password" onChange={handleChange(setFormData)} required/>
                <button type="submit">로그인</button>
            </form>
        </div>
    )
}

export default LoginPage;