#include <iostream>
using namespace std;

void find2replace(string &fstr, string &hs, string &re, bool &success)
{
    while(true){
        if(fstr.find(hs)==-1)
            return;
        else{
            success = true;
            fstr.replace(fstr.find(hs), 1, re);
        }
    }
}

int main()
{
    std::string str = "C++ programming";
    std::string has = "+";
    string replace = "p";
    bool result = false;

    cout << "���� �� ���ڿ� = " << str << endl;

    find2replace(str, has, replace, result);

    if (result == true)
        cout << "���� �� ���ڿ� = " << str << endl;
    else
        cout << str << "���� " << has << "�� �߰����� ����." << endl;
    return 0;
}