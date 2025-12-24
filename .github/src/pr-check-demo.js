/**
 * PR Check Demo - 演示代码示例
 * 这是一个简单的 JavaScript 演示文件
 */

// 示例1: 验证 PR 标题格式
function validatePRTitle(title) {
  const validPrefixes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'];
  const regex = new RegExp(`^(${validPrefixes.join('|')})(\\(.+\\))?: .+`);
  
  if (!title || title.trim().length === 0) {
    return { valid: false, message: 'PR 标题不能为空' };
  }
  
  if (!regex.test(title)) {
    return { 
      valid: false, 
      message: `PR 标题格式不正确。应该以 ${validPrefixes.join(', ')} 之一开头` 
    };
  }
  
  return { valid: true, message: 'PR 标题格式正确' };
}

// 示例2: 检查代码变更行数
function checkChangedLines(additions, deletions) {
  const maxChanges = 500;
  const totalChanges = additions + deletions;
  
  if (totalChanges > maxChanges) {
    return {
      status: 'warning',
      message: `变更行数较多 (${totalChanges} 行)，建议拆分为多个 PR`
    };
  }
  
  return {
    status: 'success',
    message: `变更行数合理 (${totalChanges} 行)`
  };
}

// 示例3: 验证文件类型
function validateFileTypes(files) {
  const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.yml', '.yaml'];
  const invalidFiles = [];
  
  files.forEach(file => {
    const ext = file.substring(file.lastIndexOf('.'));
    if (!allowedExtensions.includes(ext)) {
      invalidFiles.push(file);
    }
  });
  
  return {
    valid: invalidFiles.length === 0,
    invalidFiles,
    message: invalidFiles.length > 0 
      ? `发现不允许的文件类型: ${invalidFiles.join(', ')}` 
      : '所有文件类型都是允许的'
  };
}

// 示例4: 生成 PR 检查报告
function generateCheckReport(prData) {
  const report = {
    timestamp: new Date().toISOString(),
    prNumber: prData.number,
    checks: []
  };
  
  // 标题检查
  const titleCheck = validatePRTitle(prData.title);
  report.checks.push({
    name: 'Title Format',
    ...titleCheck
  });
  
  // 变更行数检查
  const linesCheck = checkChangedLines(prData.additions, prData.deletions);
  report.checks.push({
    name: 'Changed Lines',
    ...linesCheck
  });
  
  // 文件类型检查
  const filesCheck = validateFileTypes(prData.files);
  report.checks.push({
    name: 'File Types',
    ...filesCheck
  });
  
  return report;
}

// 导出函数供其他模块使用
module.exports = {
  validatePRTitle,
  checkChangedLines,
  validateFileTypes,
  generateCheckReport
};

// 示例使用
if (require.main === module) {
  const examplePR = {
    number: 123,
    title: 'feat(api): 添加用户认证功能',
    additions: 150,
    deletions: 30,
    files: ['src/auth.js', 'src/utils.js', 'README.md']
  };
  
  const report = generateCheckReport(examplePR);
  console.log('PR 检查报告:');
  console.log(JSON.stringify(report, null, 2));
}

