#include <iostream>
#include <string>
using namespace std;

string removeChar(string str, char c){
    do{
        if(str.find(c)!=-1){
            str.erase(str.find(c),1);
        }
        else{
           return str;
        }
    }while(true);
};
string findAndReplace(string str, string olds, string news){
    int oldLength = olds.length();
    int loc = str.find(olds);
    str.erase(loc, oldLength);
    str.insert(loc, news);
    return str;
};

int main(){
    string str;
    char c;
    cout << "문자열 입력 : ";
    getline(cin, str);
    cout << "삭제하고자 하는 문자 입력 : ";
    cin >> c;
    cout << "삭제 후 문자열 = " << removeChar(str, c) << endl << endl;

    string str1 = "an old string";
    string str2("an old");
    string str3("a new");

    cout << str1 << "에서";
    string strnew = findAndReplace(str1, str2, str3);
    cout << str2 << "문자열을" << str3 << "로 교체 후 문자열 = " << strnew << endl;
    return 0;
}