#include <iostream>
#include <iomanip>
#include <cstdio>
//�� ���ڿ��� gets�� �޾� ���� ������ ��
using namespace std;
int main(){
    //c�� ������ �迭 ������ ��
    char a[100];
    char b[100];

    char* pa;
    char* pb;

    cout << "ù ��° ���ڿ� �Է� : ";
    gets(a);
    cout << "�� ��° ���ڿ� �Է� : ";
    gets(b);

    pa = a;
    pb = b;

    if(sizeof(pa) == sizeof(pb)){
        for(int i = 0; i < sizeof(pa); i++){
            if(pa[i] != pb[i]){
                cout << "�� ���ڿ��� �ٸ��ϴ�!!";
                return 0;
            }
        }
        cout << "�� ���ڿ��� �����ϴ�!";
    }
    else{
        cout << "�� ���ڿ��� �ٸ��ϴ�!!";
    }

    return 0;
}