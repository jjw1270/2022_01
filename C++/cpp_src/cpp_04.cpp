#include <iostream>
#include <iomanip>
//cpp_02_기본입문_ex 10번
int main(){
    double a, b, c;
    double tot = 0;
    double evg = 0;

    std::cout << "퀴즈, 중간고사, 기말고사 성적을 입력하세요 : ";
    std::cin >> a >> b >> c;

    tot = a + b + c;
    std::cout << "total : " << tot << std::endl;

    evg = tot / 3;
    std::cout << "everage : " << std::fixed << std::setprecision(2) << evg;

    return 0;
}