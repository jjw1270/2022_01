#include <iostream>
using namespace std;

int main(){
    enum class RPS{Rack = 1, Paper, Sissors};
    do{
        cout << "���� �Է�(1,2,3�� �ƴ� ���� ���α׷�����) : ";
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