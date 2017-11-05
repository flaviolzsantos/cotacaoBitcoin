$(function () {
    $('#valorInvestido').maskMoney();
    $("#resultado").hide();
    $("#aguarde").hide();

    $("#datetimepicker1").datetimepicker({format: 'DD/mm/YYYY'});
    $("#datetimepicker2").datetimepicker({format: 'DD/mm/YYYY'});
});
function verCotacao(){

    var dtinicial = dataInicial();
    var dtFinal = dataFinal();
    if(dtFinal == undefined || dtinicial == undefined)
        return;
    if($("#valorInvestido").val() == ""){
        alert("Digite o valor investido");
        return;
    }

    $("#aguarde").show();
    $.get("https://api.coindesk.com/v1/bpi/historical/close.json?start="+dtinicial+"&end="+dtFinal,function(data){

        $.get("https://api.fixer.io/"+dtinicial+"?base=USD", function(dolarInicial){
            

            $.get("https://api.fixer.io/"+dtFinal+"?base=USD", function(dolarFinal){
                $("#resultado").show();
                $("#aguarde").hide();
                var dados = JSON.parse(data);
                var bpi = dados.bpi;
                var bpiString = JSON.stringify(bpi);
                var bpiDate = JSON.parse(bpiString);
        
                var valorBitCoinInicial = bpiDate[dtinicial];
                var valorBitCoinFinal = bpiDate[dtFinal];
                var valorInvestido = $("#valorInvestido").val().replace(",","");
        
                $("#diaInicial").html(dataInicialUsuario());
                $("#valorInicial").html(valorBitCoinInicial);
                $("#valorDolarInicial").html(dolarInicial.rates["BRL"].toFixed(2));
                $("#valorDolarFinal").html(dolarFinal.rates["BRL"].toFixed(2));
        
                $("#diaFinal").html(dataFinalUsuario());
                $("#valorFinal").html(valorBitCoinFinal);
        
                $("#diferenca").html((valorBitCoinFinal - valorBitCoinInicial).toFixed(4));

                var valorGastoDolarInicial = valorInvestido / dolarInicial.rates["BRL"].toFixed(2);
                $("#valorGastoDolarInicial").html(valorGastoDolarInicial.toFixed(2));
                $("#quantidadeCompradaBitcoinsInicial").html((valorGastoDolarInicial / valorBitCoinInicial).toFixed(8));
                var lucroDolar = ((valorGastoDolarInicial / valorBitCoinInicial).toFixed(8) * valorBitCoinFinal).toFixed(2);
                $("#lucroDolar").html(lucroDolar);
                $("#lucroReal").html((((valorGastoDolarInicial / valorBitCoinInicial).toFixed(8) * valorBitCoinFinal).toFixed(2) / dolarFinal.rates["BRL"]).toFixed(2))
                $("#valorRecebidoReal").html((lucroDolar * dolarFinal.rates["BRL"].toFixed(2)).toFixed(2));

                var valorGastoDolarFinal = valorInvestido * dolarFinal.rates["BRL"].toFixed(2);
                $("#valorGastoDolarFinal").html(valorGastoDolarFinal.toFixed(2));
                $("#quantidadeVendidaBitcoinsFinal").html((valorGastoDolarFinal / valorBitCoinFinal).toFixed(8));

                $("#deixouGanha").html((valorGastoDolarFinal - valorGastoDolarInicial).toFixed(2));
                
                $("#deixouGanhaReal").html(((lucroDolar * dolarFinal.rates["BRL"].toFixed(2)).toFixed(2) - valorInvestido).toFixed(2));

            });
        });
        

    }).fail(function(erro){
        alert("Deu erro na api");
    })
}

function dataInicial(){

    var date = $("#datetimepicker1").data("DateTimePicker").date();
    return formataData(date);
}

function dataFinal(){
    
    var date = $("#datetimepicker2").data("DateTimePicker").date();
    return formataData(date);
    
}

function formataData(date){
    if(date == null){
        alert("data invalida")
        return;
    }

    var dia = "";
    var mes = "";
    
    if(date.date().toString().length == 1)
        dia = "0" + date.date().toString();
    else
        dia = date.date().toString();
    
    if((date.month() + 1).toString().length == 1)
        mes = "0" + (date.month() + 1).toString();
    else
        mes = (date.month() + 1).toString();

    var formatted = date.year() + "-" + mes + "-" + dia;
    return formatted;
}


function dataInicialUsuario(){
    
        var date = $("#datetimepicker1").data("DateTimePicker").date();
        return formataDataUsuario(date);
    }
    
    function dataFinalUsuario(){
        
        var date = $("#datetimepicker2").data("DateTimePicker").date();
        return formataDataUsuario(date);
        
    }
function formataDataUsuario(date){
    
    var dia = "";
    var mes = "";
    
    if(date.date().toString().length == 1)
        dia = "0" + date.date().toString();
    else
        dia = date.date().toString();

    if(date.month().toString().length == 1)
        mes = "0" + (date.month() + 1).toString();
    else
        mes = (date.month() + 1).toString();

    var formatted = dia + "/" + mes + "/" + date.year();
    return formatted;
}

