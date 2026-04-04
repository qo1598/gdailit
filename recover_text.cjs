const fs = require('fs');

try {
    // Mission_temp.txt를 바이트 단위로 읽습니다.
    const buffer = fs.readFileSync('src/components/Mission_temp.txt');
    
    // UTF-8 BOM이 있다면 제거합니다.
    let cleanBuffer = buffer;
    if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        cleanBuffer = buffer.slice(3);
    }

    // 1단계: 현재 파일은 "UTF-8로 작성된 CP949 캐릭터들"의 형태일 가능성이 큽니다.
    // 일단 바이트를 그대로 유지하면서 문자열로 변환합니다.
    const rawString = cleanBuffer.toString('binary');
    
    // 2단계: 다시 바이트로 변환한 뒤 UTF-8로 해석합니다.
    // (일반적인 Mojibake 복구 로직: UTF8 -> Byte -> UTF8)
    // 하지만 현재 현상은 UTF8 -> CP949(로 오인) -> UTF8 저장 상황입니다.
    
    // 직접적인 바이트 변환 시도
    const recovered = Buffer.from(cleanBuffer.toString('utf8'), 'latin1').toString('utf8');

    // 만약 위 방법이 안된다면, Buffer를 직접 처리하는 방식들을 시도해볼 수 있습니다.
    // 파일에 저장하여 사용자에게 확인 요청
    fs.writeFileSync('src/components/Mission_recovered_final.jsx', recovered);
    
    console.log('--------------------------------------------------');
    console.log('복구 스크립트 실행 결과:');
    console.log('src/components/Mission_recovered_final.jsx 파일이 생성되었습니다.');
    console.log('일부 라인을 출력하여 확인합니다:');
    
    const lines = recovered.split('\n');
    for(let i=18; i<25; i++) {
        if(lines[i]) console.log(`${i+1}: ${lines[i].trim()}`);
    }
    console.log('--------------------------------------------------');

} catch (err) {
    console.error('스크립트 실행 중 오류 발생:', err);
}
