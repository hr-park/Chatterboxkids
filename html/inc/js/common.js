function gnbOpen(){
    $('.gnb_side_menu').addClass('open');
    $('.gnb_dim').show();
    $('body').css('overflow', 'hidden'); // 스크롤 방지
}

function gnbClose(){
    $('.gnb_side_menu').removeClass('open');
    $('.gnb_dim').hide();
    $('body').css('overflow', '');
}

function winTop(){
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/*
function fnc_terms() {
    var newwin = window.open('../popup/terms.html', 'terms', 'width=600,height=650,left=100,top=0,scrollbars=yes');
    newwin.focus();
}

function fnc_policy() {
    var newwin = window.open('../popup/policy.html', 'policy', 'width=600,height=650,left=100,top=0,scrollbars=yes');
    newwin.focus();
}

function fnc_email() {
    var newwin = window.open('../popup/email.html', 'email', 'width=600,height=650,left=100,top=0,scrollbars=yes');
    newwin.focus();
}
*/