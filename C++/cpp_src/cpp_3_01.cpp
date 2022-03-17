#include <iostream>
#include <cstdlib>

using namespace std;
//아스키코드로 비교
char list_exam(initializer_list<char> lst, char chr){
    int min = 128;
    char rst;
    for(char value : lst){
        int minTmp = abs(value - chr);

        if(min > minTmp){
            //최소값
            rst = value;
            min = minTmp;
        }
    }
    return rst;
}

int main(){
    cout<<"{'d', 'p', 'r', 'w', 'g', 'f'}문자 중 h와 가까운 문자는 : ";
    cout << list_exam({'d', 'p', 'r', 'w', 'g', 'f'}, 'h') << endl;

    cout << "{'k', 'q', 'b', 'r', 'a', 'e', 'v', 'z'} 문자 중 w와 가까운 문자는: ";
    cout << list_exam({'k', 'q', 'b', 'r', 'a', 'e', 'v', 'z'}, 'w') << endl;
}