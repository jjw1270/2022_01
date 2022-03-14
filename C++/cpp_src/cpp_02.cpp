#include <iostream>
#include <iomanip>
#include <cstdio>
//두 문자열을 gets로 받아 둘이 같은지 비교
using namespace std;
int main(){
    //c의 포인터 배열 공부할 것
    char a[100];
    char b[100];

    char* pa;
    char* pb;

    cout << "첫 번째 문자열 입력 : ";
    gets(a);
    cout << "두 번째 문자열 입력 : ";
    gets(b);

    pa = a;
    pb = b;

    if(sizeof(pa) == sizeof(pb)){
        for(int i = 0; i < sizeof(pa); i++){
            if(pa[i] != pb[i]){
                cout << "두 문자열은 다릅니다!!";
                return 0;
            }
        }
        cout << "두 문자열은 같습니다!";
    }
    else{
        cout << "두 문자열은 다릅니다!!";
    }

    return 0;
}