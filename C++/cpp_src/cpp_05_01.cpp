#include <iostream>
using namespace std;

void find2replace(string &fstr, string &hs, string &re, bool &success)
{
    for (auto &a : fstr)
    {
        if (a == re)
        {
            success = true;
            a = re;
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