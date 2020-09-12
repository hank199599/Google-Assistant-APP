
var options=['＋','－','×','／'];
const replaceString = require('replace-string');

function judger(a,b,operator)
{
	var temp="";

	if(options.indexOf(operator)!==-1){temp=a+operator+b}
	else {temp=a+"☐"+b}

	return temp
}

function generator(question_list,operator_list){

	var temp="";
	for(var i=0;i<3;i++)
	{ 
		if(temp.length===0){ temp=judger(question_list[0],question_list[1],operator_list[0]);}
		else{temp=judger(temp,question_list[i+1],operator_list[i]);}
	}
  return temp
}

function final(question_list,operator_list){

	var formula=generator(question_list,operator_list);
	
	formula=replaceString(formula,"＋","+");
	formula=replaceString(formula,"－","-");
	formula=replaceString(formula,"×","*");
	formula=replaceString(formula,"／","/");

  return eval(formula)
}

module.exports = {generator,final}
