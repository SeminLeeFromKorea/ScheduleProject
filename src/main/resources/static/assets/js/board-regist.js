//summernote editor
//빈 파일 배열을 생성한다 - 가공 처리(빈 배열 생성 안했을 때 없는 파일 추가 됨)
var inputFileList = new Array();

$(document).ready(function() {
    $('#summernote').summernote({
        height: 270,
        minHeight: null,
        maxHeight: null,
        focus: true,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
        ]
    });
    
    //파일 이름 목록에 추가 
     $('#formFile').on('change', function(e) {
    let files = $(this).prop('files');

    let fileNames = "";
    if (files && files.length > 0) { // 파일이 첨부되어 있는 경우
      for (var i = 0; i < files.length; i++) {
        fileNames += "<li>" + files[i].name + "</li>";
      }
      
      //change 됐을 때, 파일이 첨부되어 있을 때만 e.target.files를 받아와서 빈 배열에 넣어준다
      inputFileList = []; // 기존 정보 제거
      var fileList = e.target.files;				
	  var filesArr = Array.prototype.slice.call(fileList);
	  for(f of filesArr){
	  	inputFileList.push(f);	   
	  }

      $('#fileNames').html("<ul style='margin-top: 10px;'>" + fileNames + "</ul>");
    } else { // 파일이 첨부되어 있지 않은 경우
      $('#fileNames').empty();
      $('#fileNames').html("");
      $('#fileUpload').val(""); // value 값을 ""으로 설정
      // FormData 객체에서 파일 삭제
      let formData = new FormData($('#form')[0]);
      if (files.length === 0) {
        formData.delete('fileUpload');
        alert("첨부된 파일이 없습니다.");
      }
    }
  });   
});
    
//작성 완료 버튼 누를 시 ajax로 데이터 넘김
$("#boardSuccess").click(function(event) {
    //기본으로 정의된 이벤트를 작동하지 못하게 함, 즉 submit을 막는다.
    event.preventDefault();

    let urlParams = new URLSearchParams(window.location.search);
    let selectedCategory = $("#categorySelect option:selected").val();
    let selectedProcess = $("#processSelect option:selected").val();
    let userName = $('span[name="writer"]').text();
    let boardWriter = $('span[name="writer"]').attr('id');
    let boardTitle = $("input[name='boardTitle']").val();
    let startDate = $("input[name='startDate']").val();
    let endDate = $("input[name='endDate']").val();
    let description = $("textarea[name='description']").val();

    //제목-유효성 검사
    if (boardTitle.trim() === "") {
        $('#titleWarning').text("제목을 입력해주세요").show();
        //selectedCategory.focus();
        return false;
    } else {
        $('#titleWarning').hide();
    }

    //시작일-유효성 검사
    if (startDate == "") {
        $('#startWarning').text("시작일을 입력해주세요");
        //startDate.focus();
        return false;
    } else {
        $('#startWarning').hide();
    }

    //종료일-유효성 검사
    if (endDate == "") {
        $('#endWarning').text("종료일을 입력해주세요");
        //endDate.focus();
        return false;
    } else {
        $('#endWarning').hide();
    }

    //시작일 > 종료일-유효성 검사
    if (startDate > endDate) {
        $('#endWarning').text("종료일은 시작일보다 작을 수 없습니다.");
        $('#endWarning').show();
        startDate.focus();
        endDate.focus();
        return false;
    }

    if (description == "") {
        $('#contentWarning').text("세부 내용을 입력해주세요.")
        $('#contentWarning').show();
        return false;
    } else {
        $('#contentWarning').hide();
    }
    
    formData = new FormData($('#boardRegistForm')[0]); 
 
	//push해준 값을 배열로 돌려서 넣음 - 컨트롤러에서 처리
	//배열에서 파일 꺼내 폼 객체에 담는다
　　 for(let i = 0; i < inputFileList.length; i++) {
　　　　formData.append("fileUploadImg", inputFileList[i]);
　　 };

    //ajax로 글 등록하기
    $("#boardSuccess").prop("disabled", true);
    
    $.ajax({
        type: "POST",
        url: "../reg-board",
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        success: function(data) {
            alert("등록이 완료되었습니다.")
            location.href = "/userboards/board-list?pj_num=" + urlParams.get('pj_num');
        },
        error: function(e) {
            console.log("ERROR: ", e);
            //버튼 사용 불가
            $("#boardSuccess").prop("disabled", false);
            alert("fail");
        }
    });
});