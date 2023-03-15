
	//이메일 인증 코드 input과 button 비활성화하기
	$(document).ready(function() {

		var verifyInput = document.getElementById("user_email_verify");
		var verifyBtn = document.getElementById("user_email_verify_btn");

		verifyInput.disabled = true;
		verifyBtn.disabled = true;
	});
	
	//인증 코드를 이메일로 보내기
	function sendMail() {
		var idCheck = document.getElementById("user_id");
		var id = RegExp(/^[a-zA-Z0-9]{4,12}$/);
		var idWarning = document.getElementById("idWarning");

		var emailCheck = document.getElementById("user_email");
		var email = RegExp(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/);
		var emailWarning = document.getElementById("emailWarning");

		var email_verify_succeed = document
				.getElementById("email_verify_succeed"); // 인증 메일을 여러번 발송할 수도 있음. 메일 보내기에 성공하면 무조건 0으로 처리해 유효성 단계를 넘어가지 못하게 할 것

		idWarning.innerHTML = "";
		emailWarning.innerHTML = "";

		//아이디 공백 확인
		if (idCheck.value == "") {
			idWarning.innerHTML = "아이디를 입력해주세요.";
			idCheck.focus();
			return false;
		}

		//아이디 최소 글자수 확인
		if (idCheck.value.length < 4) {
			idWarning.innerHTML = "아이디는 4자 이상입니다.";
			idCheck.value = "";
			idCheck.focus();
			return false;
		}
		
		//아이디 최대 길이 확인
		if (idCheck.value.length > 12) {
			idWarning.innerHTML = "아이디는 12자 이하입니다.";
			idCheck.value = "";
			idCheck.focus();
			return false;
		}

		//아이디 유효성검사
		if (!id.test(idCheck.value)) {
			idWarning.innerHTML = "형식에 맞게 입력해주세요";
			idCheck.value = "";
			idCheck.focus();
			return false;
		}
		
		//이메일 공백 확인
		if (emailCheck.value == "") {
			emailWarning.innerHTML = "이메일을 입력해주세요";
			emailCheck.focus();
			return false;
		}

		// 이메일 2자 이상 확인
		// if(emailCheck.value.length < 2){
		//     alert("이메일을 다시 확인해주세요")
		//     nameCheck.focus();
		//     return false;
		// }

		//이메일 유효성 검사
		if (!email.test(emailCheck.value)) {
			emailWarning.innerHTML = "이메일형식에 맞게 입력해주세요";
			emailCheck.value = "";
			emailCheck.focus();
			return false;
		}
		
		//아이디와 이메일이 일치 여부 검사
		var checkCount = 0;
		$.ajax({
			url : "../checkIdAndEmail",
			type : "get",
			async : false,
			data : {
				"user_id" : idCheck.value,
				"user_email" : emailCheck.value,
			},
			success : function(result) {
				if(result === ""){
					emailWarning.innerHTML = "아이디와 이메일이 일치하지 않습니다. 다시 시도해주세요.";
					checkCount = 1;
				}
				
			},
			error : function(err) {
				alert("이메일 전송에 실패했습니다. 담당자에게 문의하세요.");

			}
			
		});
		
		if(checkCount == 1) {
			return false;
		}
		
		//메일 발송
		$.ajax({
			url : "../sendMail",
			type : "post",
			async : false,
			data : {
				"user_email" : emailCheck.value,
				"joinReset" : "reset"
			},
			success : function(result) {
				emailWarning.innerHTML = "이메일이 전송되었습니다. 3분 안에 인증코드를 입력해주세요!";
				email_verify_succeed.innerHTML = "0"; // 유효성 단계에서 걸리게 만들기 위함
			},
			error : function(err) {
				alert("이메일 전송에 실패했습니다. 담당자에게 문의하세요.");

			}
		});

		//이메일 전송에 성공 시 비활성화되어있던 버튼과 인풋을 해제
		var verifyInput = document.getElementById("user_email_verify");
		var verifyBtn = document.getElementById("user_email_verify_btn");
		verifyInput.disabled = false;
		verifyBtn.disabled = false;
		//이메일 전송에 성공 시 전송하기 버튼을 못누르게 막아줌
		var sendMailBtn = document.getElementById("sendMailBtn");
		sendMailBtn.disabled = true;

	}
	
	//발송된 인증 코드로 이메일 인증하기
	function verifyMail() {
		var user_email = document.getElementById("user_email");
		var verifyInput = document.getElementById("user_email_verify"); //인증 코드
		var verifyBtn = document.getElementById("user_email_verify_btn");
		var sendMailBtn = document.getElementById("sendMailBtn");

		var emailVerifyWarning = document.getElementById("emailVerifyWarning");
		var emailWarning = document.getElementById("emailWarning");

		
		var email_verify_succeed = document.getElementById("email_verify_succeed"); // 성공 시 value를 1로 변경해줘야함
			
		sendMailBtn.disabled = false;

		
		$.ajax({
			url: "../verifyMail",
			type: "get",
			data: {"user_email" : user_email.value,
				   "joinReset" : "reset"
			},
			success: function(result) {
				emailWarning.innerHTML = "";
								
				//현재 한국 시간을 구하는 코드
  				var now = new Date();
  				var offset = now.getTimezoneOffset() * 60000; //ms단위라 60000곱해줌
  				var dateOffset = new Date(now.getTime() - offset);
  				
  				var btnClicked = dateOffset.toISOString(); // 인증하기 버튼을 누른 시각을 저장
  
  				var btnClickedDay = btnClicked.substring(0, 10); // 인증하기 버튼을 누른 시점의 날 (년월일)
  				var btnClickedTime = btnClicked.substring(11, 19); // 인증하기 버튼을 누른 시점의 시각 (시분초)
  
  				var btnTime = new Date(btnClickedDay+" "+btnClickedTime); // 버튼을 누른 시점의 시간 객체를 생성
  				// var expireTime; // db에 저장된 값 가져오기
  				
  				if(result === "") { // db에 일치하는 값이 없음, 이메일을 제대로 입력하지 않은 것
					emailVerifyWarning.innerHTML = "요청한 이메일에 해당하는 값을 찾을 수 없습니다. 이메일 인증하기 버튼을 다시 눌러주세요!";
					verifyInput.disabled = true; // 버튼과 인풋을 다시 비활성화.
					verifyBtn.disabled = true;
				} else { // db에 일치하는 값이 있음. 이제 코드를 검사하고, 시간을 검사
					var expireTimeDay = result.expire_time.substring(0, 10); // db에서 가져온 값의 년월일
					var expireTimeTime = result.expire_time.substring(11, 19); // db에서 가져온 값의 시분초
				
  					var dbTime = new Date(expireTimeDay+" "+expireTimeTime); // db에 저장된 시점의 시간 객체를 생성
  						if(verifyInput.value !== result.code){ //입력한 인증코드와 DB의 인증코드가 다름
							emailVerifyWarning.innerHTML = "인증코드가 올바르지 않습니다. 이메일 인증하기 버튼을 다시 눌러주세요!";
							verifyInput.disabled = true; // 버튼과 인풋을 다시 비활성화.
							verifyBtn.disabled = true;
						} else {
			  				if(btnTime.getTime() <= dbTime.getTime()){ // 만료 시간 안에 인증 성공
								emailVerifyWarning.innerHTML = "이메일 인증에 성공하였습니다.";
								email_verify_succeed.innerHTML = "1";
							} else { // 만료 시간을 지남
								emailVerifyWarning.innerHTML = "만료시간을 지났습니다. 이메일 인증하기 버튼을 다시 눌러주세요!";
								verifyInput.disabled = true; // 버튼과 인풋을 다시 비활성화.
								verifyBtn.disabled = true;
							}
						  
						}
					
				}
  				
				
			},
			error: function(err) {
				alert("이메일 인증을 위한 이메일값 찾아오기를 실패했습니다. 담당자에게 문의 혹은 다시 시도하세요.");
			}
		});
	}
	
	//비밀번호 초기화 유효성 검사
	function resetPw() {

		var idCheck = document.getElementById("user_id");
		var email_verify_succeed = document.getElementById("email_verify_succeed"); // 이메일 인증 여부
		var verifyInput = document.getElementById("user_email_verify");
		var verifyBtn = document.getElementById("user_email_verify_btn");
		
		var id = RegExp(/^[a-zA-Z0-9]{4,12}$/);
	
		var idWarning = document.getElementById("idWarning");
	
		var resetPwForm = document.getElementById("resetPwForm");
		
		var sendMailBtn = document.getElementById("sendMailBtn");
		
		idWarning.innerHTML = "";
	
		//아이디 공백 확인
		if (idCheck.value == "") {
			idWarning.innerHTML = "아이디를 입력해주세요.";
			idCheck.focus();
			return false;
		}
	
		//아이디 공백 확인
		if (idCheck.value.length < 4) {
			idWarning.innerHTML = "아이디는 4자 이상입니다.";
			idCheck.value = "";
			idCheck.focus();
			return false;
		}
	
		//아이디 유효성검사
		if (!id.test(idCheck.value)) {
			idWarning.innerHTML = "형식에 맞게 입력해주세요";
			idCheck.value = "";
			idCheck.focus();
			return false;
		}
		
		//이메일 인증 여부 검사
		if (email_verify_succeed.innerHTML === "0") {
			emailWarning.innerHTML = "이메일 인증을 진행해주세요.";
			verifyInput.disabled = true;
			verifyBtn.disabled = true;
			sendMailBtn.disabled = false;
			emailCheck.focus();
			return false;
		}
	
		// form 전송하기
		resetPwForm.submit();
	}