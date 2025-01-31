import { BrowserRouter as Router, Routes, Route, Link, useNavigate  } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { handleChange, handleCompare, handleSubmit } from "../../../js/formUtils";

const SignUpPage = () => {
    const navigate = useNavigate();

    const [canUseUesrName, setCanUseUesrName] = useState(false);
    const [canUseUesrId, setCanUseUesrId] = useState(false);
    const [uesrNameMessage, setUesrNameMessage] = useState(null);
    const [uesrIdMessage, setUesrIdMessage] = useState(null);
    const [resultMessage, setResultMessage] = useState(null);
    const [formData, setFormData] = useState({
        userName: '',
        userId: '',
        password: '',
    });

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={(e) => {
                if(canUseUesrId && canUseUesrName){
                    handleSubmit({
                        userName: formData.userName,
                        userId: formData.userId,
                        password: formData.password,
                    }, "userData", "create", () => {
                        navigate('/login');
                    })(e);
                }
                else{
                    if(!canUseUesrName){
                        setResultMessage("닉네임 중복을 확인해주세요.");
                    }
                    if(!canUseUesrId){
                        setResultMessage("아이디 중복을 확인해주세요.");
                    }
                }
            }}>
                {/* userName 입력 */}
                <p>사용하실 닉네임을 입력해 주세요:</p>
                <input id="userName" value={formData.userName} name="userName" onChange={(e) => {
                        setCanUseUesrName(false);
                        handleChange(setFormData)(e);
                    }} required/>
                <button onClick={(e) => handleCompare("userName",formData.userName, "userData/compare",(resData) => {
                    // 닉네임 중복 확인
                    if(resData.success === false){// 닉네임 중복 안됨
                        setCanUseUesrName(true);
                        setUesrNameMessage(resData.data.message);
                    }
                    else{ // 중복됨
                        setCanUseUesrName(false);
                        setUesrNameMessage(resData.data.message);
                    }
                })(e)}>중복확인</button>
                {uesrNameMessage && (
                    <p>{uesrNameMessage}</p>
                )}

                {/* userId 입력 */}
                <p>사용하실 아이디를 입력해 주세요:</p>
                <input id="userId" value={formData.userId} name="userId" onChange={(e) => {
                    setCanUseUesrId(false);
                    handleChange(setFormData)(e);
                }} required/>
                <button onClick={(e) => handleCompare("userId", formData.userId, "userData/compare",(resData) => {
                    // 아이디 중복 확인
                    if(resData.success === false){// 아이디 중복 안됨
                        setCanUseUesrId(true);
                        setUesrIdMessage(resData.data.message);
                    }
                    else{ // 중복됨
                        setCanUseUesrId(false);
                        setUesrIdMessage(resData.data.message);
                    }
                })(e)}>중복확인</button>
                {uesrIdMessage && (
                    <p>{uesrIdMessage}</p>
                )}

                {/* password 입력 */}
                <p>사용하실 비밀번호를 입력해 주세요:</p>
                <input id="password" type="password" value={formData.password} name="password" onChange={handleChange(setFormData)} required/>

                {/* 제출 버튼 */}
                <br />
                <button type="submit" >가입</button>
                {resultMessage && (
                    <p>{resultMessage}</p>
                )}
            </form>
        </div>
    )
}

export default SignUpPage;