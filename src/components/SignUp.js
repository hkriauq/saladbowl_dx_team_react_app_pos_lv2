import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import axios from "axios"; 

function SignUp() {
  const initialValues = {
    username: "",
    mailAddress: "",
    birthDate: "",
    gender: "",
    password: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const genderText = {female: "女性", male: "男性",};  
  const navigate = useNavigate();
  const genderValues = {
    "": "", // 隠しオプションは空の文字列として設定
    "female": "1",
    "male": "2",
    "other": "3",
  };

  //フォームの入力が変更されたときにformValuesを更新、入力値を変換して保存
  const handleChange = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    if (name === "gender") {
      // genderの値の変換・更新
      setFormValues({ ...formValues, [name]: genderValues[value] });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  //FastAPIが準備できるまでの仮対応！ 
  //const handleSubmit = async (e) => {
    //e.preventDefault();
    //if (isReviewing) {
      ////onChildData(formValues.username);
      //navigate('/login'); 
    //} else {
      //const errors = validate(formValues);
      //setFormErrors(errors);
      //setIsSubmit(true);
      //if (Object.keys(errors).length === 0) {
        //setIsReviewing(true);
      //}
    //}
  //};

  //FastAPIが準備できたら下記に切り替え！  
  const api_postUrl =  "http://localhost:8000/register/";

  // ポスト処理　True:/loginへ画面遷移、False:エラー処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReviewing) {
      try {
        const response = await axios
          .post(api_postUrl, formValues)
          .then((response) => {
            const result = response.data;
            if (result.check) {
              navigate('/login');
            } else {
              console.error("POSTエラー");
            }
          })
          .catch((error) => {
            console.error('リクエストエラー:', error);
          });
      } catch (error) {
        console.error('エラー:', error);
      }
    } else {
      const errors = validate(formValues);
      setFormErrors(errors);
      setIsSubmit(true);
      if (Object.keys(errors).length === 0) {
        setIsReviewing(true);
      }
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    } else {
    }
  }, [formErrors]);


  const validate = (values) => {
    const errors = {};
    const regex1 = /^[^ 　]+$/;
    const regex2 =
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    const regex3 =
      /^[0-9]{4}$/;
    const regex4 =
      /^[0-9]{2}$/;
    const regex5 =
      /^[0-9]{2}$/; 
    const fullwidthRegex = /[０-９]/;

    //valueが空ならerrorsの配列に入れる。
    if (!values.username) {
      errors.username = "ユーザー名を入力してください";
    } else if (!regex1.test(values.username)) {
      errors.username = "ユーザー名にスペースが入っています";
    } else if (values.username.length < 4 || values.username.length > 50) {
      errors.username = "ユーザー名は4文字以上50文字以内で入力してください";
    }
    if (!values.mailAddress) {
      errors.mailAddress = "メールアドレスを入力してください";
    } else if (!regex2.test(values.mailAddress)) {
      errors.mailAddress = "正しいメールアドレスを入力してください";
    } else if (values.mailAddress.length > 225) {
      errors.mailAddress = "メールアドレスは225文字以下で入力してください";
    }
    if (
      !values.birthYear ||
      !values.birthMonth ||
      !values.birthDay
    ) {
      errors.birthDate = "生年月日を入力してください";
    } else if (
      !regex3.test(values.birthYear) ||
      !regex4.test(values.birthMonth) ||
      !regex5.test(values.birthDay)
    ) {
      errors.birthDate = "正しい生年月日を入力してください";
    }
    if (
      fullwidthRegex.test(values.birthYear) ||
      fullwidthRegex.test(values.birthMonth) ||
      fullwidthRegex.test(values.birthDay)
    ) {
      errors.birthDate = "半角数字で生年月日を入力してください.";
    }
    if (!values.gender || values.gender === "") {
      errors.gender = "性別を選択してください";
    }
    if (!values.password) {
      errors.password = "パスワードを入力してください";
    } else if (values.password.length < 4) {
      errors.password = "4文字以上64文字以下のパスワードを入力してください";
    } else if (values.password.length > 64) {
      errors.password = "4文字以上64文字以下のパスワードを入力してください";
    }
    return errors;
  };


  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <h2>新規登録</h2>
        <hr />
         <div className="uiForm">
          {isReviewing ? (
          // 確認画面
              <div className="userInfo">
                <p>ユーザー名: {formValues.username}</p>
                <p>メールアドレス: {formValues.mailAddress}</p>
                <p>生年月日: {formValues.birthYear}年 {formValues.birthMonth}月 {formValues.birthDay}日</p>
                <p>性別: {genderText[formValues.gender] || "選択しない"}</p>
                <p>パスワード: ********</p> {/* パスワードはセキュリティ上表示しない */}
                <Button
                 type = 'submit'
                 className="submitButton"
                >登録</Button>
              </div>
            ) : (

         // 入力フォーム
              <>
          <div className="formField">
            <label>ユーザー名</label>
            <input
              type="text"
              name="username"
              placeholder="ユーザー名"
              value={formValues.username}
              onChange={(e) => handleChange(e)}
            />
          </div><p className="errorMsg">{formErrors.username}</p>

          <div className="formField">
            <label>メールアドレス</label>
            <input
              type="text"
              name="mailAddress"
              placeholder="メールアドレス"
              value={formValues.mailAddress}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <p className="errorMsg">{formErrors.mailAddress}</p>

          <div className="formField">
            <label>生年月日</label>
            <div className="birthDateSelect">
              <input
                type="text"
                inputMode="numeric" 
                name="birthYear"
                placeholder="年"
                value={formValues.birthYear}
                onChange={handleChange}
              />
              <input
                type="text"
                inputMode="numeric" 
                name="birthMonth"
                placeholder="月"
                value={formValues.birthMonth}
                onChange={handleChange}
              />
              <input
                type="text"
                inputMode="numeric" 
                name="birthDay"
                placeholder="日"
                value={formValues.birthDay}
                onChange={handleChange}
              />
            </div>
            <p className="errorMsg">{formErrors.birthDate}</p>
          </div>

          <div className="custom-select">
            <label>性別</label>
            <div class="styled-select">
              <select
                name="gender"
                value={formValues.gender}
                onChange={handleChange}
              >
                <option value="" disabled hidden>性別</option>
                <option value="female">女性</option>
                <option value="male">男性</option>
                <option value="other">指定しない</option>
              </select>
            </div>
          </div>
              <p className="errorMsg">{formErrors.gender}</p>

          
          <div className="formField">
            <label>パスワード</label>
            <input
              type="password"
              name="password"
              placeholder="パスワード"
              value={formValues.password}
              onChange={(e) => handleChange(e)}
            />
          </div>
            <p className="errorMsg">{formErrors.password}</p>

          <Button
                type="submit"
                className="submitButton"
              >
                {isSubmit ? "入力確認" : "登録"}
          </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}


export default SignUp;