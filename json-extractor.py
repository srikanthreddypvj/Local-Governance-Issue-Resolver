from bs4 import BeautifulSoup
filePath = str(input("Please enter the .html file path: "))
soup = BeautifulSoup(open(filePath), "html.parser")
outputFilePath = str(input("Please enter the output file path: "))
f =  open(outputFilePath,"a")
codeBlocks = soup.findAll("ms-code-block")
for codeBlock in codeBlocks:
    codes = codeBlock.findAll("code")
    print(f"The no of codes are {len(codes)}")
    for code in codes:
        f.write(code.text)
f.close()
