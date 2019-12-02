$(document).ready(function(){
    $('#vbc').on('change keyup input', function () {
        if($('#vbc').val() !== '') {
            $('#vbc').css("background-color",'#e5e6df');
        }
        else {
            $('#vbc').css("background-color",'white');
        }
    });
});
function decodeVbc() {
    var vbc = $('#vbc').val();
    var version, accountNo, euros, cents, reserve, refNo, dueDate;
    if(vbc === '' || vbc.length !== 54 || !/^\d+$/.test(vbc)) {
        alert('Please input a valid Virtual code to decode');
        return;
    }
    version = vbc.charAt(0);
    accountNo = vbc.substr(1, 16);
    euros = parseInt(vbc.substr(17, 6));
    cents = vbc.substr(23, 2);
    var total = euros.toLocaleString() + '.' +cents
    if(version === '5') {
        refNo = vbc.substr(25, 23);
        var rfCoef =  refNo.substr(0, 2);
        var rfRemaining = refNo.substr(2);
        var zeroFree = '';
        var leadZero = false;
        for(var i = 0; i < rfRemaining.length; i++) {
            if(rfRemaining.charAt(i) !== '0' || leadZero) {
                zeroFree = zeroFree + rfRemaining.charAt(i)
                leadZero = true;
            }
        }
        refNo = "RF" + rfCoef +  zeroFree;
    }
    else {
        refNo = vbc.substr(28, 20);
        var zeroFree = '';
        for(var i = 0; i < refNo.length; i++) {
            if(refNo.charAt(i) !== '0' || leadZero) {
                zeroFree = zeroFree + refNo.charAt(i)
                leadZero = true;
            }
        }
        refNo = zeroFree;
    }
    dueDate = vbc.substr(48, 6);
    if(dueDate === '000000') {
        dueDate = 'None';
    }
    else {
        dueDate = dueDate.substr(4) + '.' + dueDate.substr(2, 2) + '.' + '20'+dueDate.substr(0,2);
    }
    $('#accountNo').text(accountNo);
    $('#amountPaid').text(total);
    $('#paymentReference').text(refNo);
    $('#dueDate').text(dueDate);
    $("#barcode").JsBarcode(vbc);


}

function showHideCusInfo() {
    if($('.cusInfo').is(':hidden')) {
        $('.cusInfo').show();
        $('#hideCus').text('Hide');
    }
    else{
        $('.cusInfo').hide();
        $('#hideCus').text('Show');
    }
}

