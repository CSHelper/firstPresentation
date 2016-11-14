void main(){
  int output = addition(1,2);
  printf("\n%d", output);
  if(output != 3) {
    exit(1);
  }
  exit(0);
}
int addition(int a, int b) {
    return a+b;
}