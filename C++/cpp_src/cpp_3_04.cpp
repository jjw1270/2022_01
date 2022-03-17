#include <iostream>
using namespace std;

int main(){
    enum class RPS{Rack = 1, Paper, Sissors};
    do{
        cout << "정수 입력(1,2,3이 아닌 수는 프로그램종료) : ";
        int num;
        cin >> num;
        if(num<1||num>3) break;
        RPS rps = static_cast<RPS>(num);
        if(static_cast<int>(rps) == 1){
            cout << "Rack" << endl;
        }
        else if(static_cast<int>(rps) == 2){
            cout << "Paper" << endl;
        }
        else{
            cout << "Sissors" << endl;
        }
    }while(true);
}