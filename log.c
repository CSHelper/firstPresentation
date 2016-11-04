void main(){
  int output = addition(2,3);
  printf("%d", output);
  if(output != 5) {
    exit(1);
  }
  exit(0);
}
int addition(int a, int b) {


  return a+b;
}