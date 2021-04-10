function picture(UVI) {
    if (UVI === 0) {
        return "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=%200%20";
    } else if (UVI > 0 && UVI < 3) {
        return "https://dummyimage.com/1037x539/1e9165/ffffff.png&text=" + UVI;
    } else if (UVI >= 3 && UVI < 6) {
        return "https://dummyimage.com/1037x539/fc920b/ffffff.png&text=" + UVI;
    } else if (UVI >= 6 && UVI < 8) {
        return "https://dummyimage.com/1037x539/ef4621/ffffff.png&text=" + UVI;
    } else if (UVI >= 8 && UVI < 11) {
        return "https://dummyimage.com/1037x539/b71411/ffffff.png&text=" + UVI;
    } else {
        return "https://dummyimage.com/1037x539/4f1770/ffffff.png&text=" + UVI;
    }
}

function info(UVI) {

    if (UVI >= 0 && UVI < 3) {
        return "基本上不需要保護措施，可以安心外出，但請留意瞬間的紫外線。";
    } else if (UVI >= 3 && UVI < 6) {
        return "外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";
    } else if (UVI >= 6 && UVI < 8) {
        return "暴露在陽光下30分鐘會造成曬傷。外出時，盡量待在陰涼處。並卓長袖上衣、帽子、陽傘、防護霜、太陽眼鏡作為保護。";
    } else if (UVI >= 8 && UVI < 11) {
        return "暴露在陽光下20分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。"
    } else {
        return "健康威脅達到緊急，暴露在陽光下15分鐘會造成曬傷，早上十點至下午兩點最好不要在烈日下活動。並使用帽子、陽傘、防護霜、太陽眼鏡作為保護。";
    }
}

function info_output(UVI) {
    if (UVI >= 0 && UVI < 3) {
        return "可以安心外出，但請留意瞬間的紫外線。";
    } else if (UVI >= 3 && UVI < 6) {
        return "1.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n2.儘量待在陰涼處";
    } else if (UVI >= 6 && UVI < 8) {
        return "1.曬傷時間：30分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡。  \n3.儘量待在陰涼處。";
    } else if (UVI >= 8 && UVI < 11) {
        return "1.曬傷時間：20分鐘內  \n2.防護措施：	帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動"
    } else {
        return "1.曬傷時間：15分鐘內  \n2.防護措施：帽子/陽傘+防曬液+太陽眼鏡+長袖衣物。  \n3.儘量待在陰涼處  \n4.10至14時最好不在烈日下活動";
    }
}

function picture_small(UVI) {
    if (UVI == 0) {
        return "https://dummyimage.com/1933x1068/1e9165/ffffff.png&text=%200%20";
    }
    if (UVI > 0 && UVI < 3) {
        return "https://dummyimage.com/1933x1068/1e9165/ffffff.png&text=" + UVI;
    } else if (UVI >= 3 && UVI < 6) {
        return "https://dummyimage.com/1933x1068/fc920b/ffffff.png&text=" + UVI;
    } else if (UVI >= 6 && UVI < 8) {
        return "https://dummyimage.com/1933x1068/ef4621/ffffff.png&text=" + UVI;
    } else if (UVI >= 8 && UVI < 11) {
        return "https://dummyimage.com/1933x1068/b71411/ffffff.png&text=" + UVI;
    } else if (UVI >= 11) {
        return "https://dummyimage.com/1933x1068/4f1770/ffffff.png&text=" + UVI;
    } else {
        return "https://dummyimage.com/1933x1068/232830/ffffff.png&text=NaN";
    }
}

function status(UVI) {
    if (UVI >= 0 && UVI < 3) {
        return "低量級";
    } else if (UVI >= 3 && UVI < 6) {
        return "中量級";
    } else if (UVI >= 6 && UVI < 8) {
        return "高量級";
    } else if (UVI >= 8 && UVI < 11) {
        return "過量級";
    } else if (UVI >= 11) {
        return "危險級";
    } else {
        return "儀器故障或校驗";
    }

}

module.exports = { picture, info, info_output, status, picture_small }