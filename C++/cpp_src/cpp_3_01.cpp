#include <iostream>
#include <cstdlib>

using namespace std;
//�ƽ�Ű�ڵ�� ��
char list_exam(initializer_list<char> lst, char chr){
    int min = 128;
    char rst;
    for(char value : lst){
        int minTmp = abs(value - chr);

        if(min > minTmp){
            //�ּҰ�
            rst = value;
            min = minTmp;
        }
    }
    return rst;
}

int main(){
    cout<<"{'d', 'p', 'r', 'w', 'g', 'f'}���� �� h�� ����� ���ڴ� : ";
    cout << list_exam({'d', 'p', 'r', 'w', 'g', 'f'}, 'h') << endl;

    cout << "{'k', 'q', 'b', 'r', 'a', 'e', 'v', 'z'} ���� �� w�� ����� ���ڴ�: ";
    cout << list_exam({'k', 'q', 'b', 'r', 'a', 'e', 'v', 'z'}, 'w') << endl;
}