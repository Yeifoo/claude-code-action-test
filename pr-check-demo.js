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

// 示例4: 检查 PR 描述
function validatePRDescription(description) {
  const minLength = 20;

  if (!description || description.trim().length === 0) {
    return { valid: false, message: 'PR 描述不能为空' };
  }

  if (description.trim().length < minLength) {
    return {
      valid: false,
      message: `PR 描述太短，至少需要 ${minLength} 个字符`
    };
  }

  // 检查是否包含必要的部分
  const hasWhatChanged = /##?\s*(what|变更|改动)/i.test(description);
  const hasWhy = /##?\s*(why|原因|目的)/i.test(description);

  if (!hasWhatChanged && !hasWhy) {
    return {
      valid: true,
      message: 'PR 描述有效，但建议添加"变更内容"和"变更原因"部分'
    };
  }

  return { valid: true, message: 'PR 描述格式良好' };
}

// 示例5: 检查是否有测试文件
function checkTestCoverage(files) {
  const sourceFiles = files.filter(f =>
    (f.endsWith('.js') || f.endsWith('.ts')) &&
    !f.includes('.test.') &&
    !f.includes('.spec.')
  );

  const testFiles = files.filter(f =>
    f.includes('.test.') || f.includes('.spec.')
  );

  if (sourceFiles.length > 0 && testFiles.length === 0) {
    return {
      status: 'warning',
      message: '检测到源代码变更但没有对应的测试文件，建议添加测试'
    };
  }

  return {
    status: 'success',
    message: testFiles.length > 0
      ? `包含 ${testFiles.length} 个测试文件`
      : '无需测试文件'
  };
}

// 示例6: 生成 PR 检查报告
function generateCheckReport(prData) {
  const report = {
    timestamp: new Date().toISOString(),
    prNumber: prData.number,
    author: prData.author || 'unknown',
    checks: []
  };

  // 标题检查
  const titleCheck = validatePRTitle(prData.title);
  report.checks.push({
    name: 'Title Format',
    ...titleCheck
  });

  // 描述检查
  if (prData.description !== undefined) {
    const descCheck = validatePRDescription(prData.description);
    report.checks.push({
      name: 'Description',
      ...descCheck
    });
  }

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

  // 测试覆盖检查
  const testCheck = checkTestCoverage(prData.files);
  report.checks.push({
    name: 'Test Coverage',
    ...testCheck
  });

  // 计算总体状态
  report.overallStatus = report.checks.every(c =>
    c.valid !== false && c.status !== 'error'
  ) ? 'passed' : 'needs_attention';

  return report;
}

// 导出函数供其他模块使用
module.exports = {
  validatePRTitle,
  checkChangedLines,
  validateFileTypes,
  validatePRDescription,
  checkTestCoverage,
  generateCheckReport
};



