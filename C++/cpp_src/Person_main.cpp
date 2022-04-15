#include <iomanip>
#include <iostream>
#include <initializer_list>
#include <string>
using namespace std;

char list_exam(initializer_list<char> clst, char chr){
    char result;
    char res;
    int min = 99999;
    for (char cnum : clst){
        res = cnum - chr;
        res = res * res;
        if(res < min){
            min = res;
            result = cnum;
        }
    }
    return result;
}

int main() {
    cout << "{'d', 'p', 'r', 'w', 'g', 'f' } ���� �� h�� ����� ���ڴ� : ";
    cout << list_exam( {'d', 'p', 'r', 'w', 'g', 'f'}, 'h') << endl;

    cout << "{'k', 'q', 'b', 'r', 'a', 'e', 'v', 'z' } ���� �� w�� ����� ���ڴ� : ";
    cout << list_exam( {'k', 'q', 'b', 'r', 'a', 'e', 'v', 'z'}, 'w') << endl;
}