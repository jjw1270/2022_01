#include <iostream>
#include <iomanip>
//cpp_02_�⺻�Թ�_ex 10��
int main(){
    double a, b, c;
    double tot = 0;
    double evg = 0;

    std::cout << "����, �߰����, �⸻��� ������ �Է��ϼ��� : ";
    std::cin >> a >> b >> c;

    tot = a + b + c;
    std::cout << "total : " << tot << std::endl;

    evg = tot / 3;
    std::cout << "everage : " << std::fixed << std::setprecision(2) << evg;

    return 0;
}