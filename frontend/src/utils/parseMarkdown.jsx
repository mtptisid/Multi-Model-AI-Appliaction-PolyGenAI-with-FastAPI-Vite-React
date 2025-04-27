import React from 'react';
import { FiCopy } from 'react-icons/fi';

const emojiMap = {
  'Building': '🚀',
  'Understand': '🎯',
  'Focus': '✨',
  'Visual': '🎨',
  'Color': '🎨',
  'Typography': '🔤',
  'Imagery': '🖼️',
  'Spacing': '📐',
  'Consistency': '🎯',
  'Animations': '🎬',
  'Inspiration': '🛠️',
  'Platform': '📱',
  'short': '🎯',
  'What': '🤔',
  'Good': '🎉'
};

const parseMarkdown = (text, handleCopy, copiedStates, messageIndex) => {
  if (!text) return null;

  // Language-specific keywords and styles
  const syntaxHighlight = (code, language) => {
    let highlightedCode = code;

    // Define language-specific rules
    const rules = {
      python: {
        keywords: /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|with|in|is|not|and|or|True|False|None)\b/g,
        comments: /#.*$/gm,
        variables: /def\s+(\w+)/g,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad', // Purple
        commentColor: '#008000', // Green
        variableColor: '#87ceeb', // Sky blue
        stringColor: '#ff0000' // Red
      },
      javascript: {
        keywords: /\b(function|const|let|var|if|else|for|while|return|import|export|from|as|try|catch|new|this|true|false|null|undefined)\b/g,
        comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
        variables: /(const|let|var)\s+(\w+)/g,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad',
        commentColor: '#008000',
        variableColor: '#87ceeb',
        stringColor: '#ff0000'
      },
      java: {
        keywords: /\b(public|private|protected|class|interface|void|int|double|float|boolean|if|else|for|while|return|new|try|catch|throw|throws|static|final|abstract|synchronized)\b/g,
        comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
        variables: /(int|double|float|boolean)\s+(\w+)/g,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad',
        commentColor: '#008000',
        variableColor: '#87ceeb',
        stringColor: '#ff0000'
      },
      html: {
        keywords: /\b(div|span|p|h1|h2|h3|h4|h5|h6|a|img|ul|ol|li|table|tr|td|th|form|input|s|section|article|header|footer|nav|main|aside)\b/g,
        comments: /<!--[\s\S]*?-->/gm,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad',
        commentColor: '#008000',
        stringColor: '#ff0000'
      },
      bash: {
        keywords: /\b(if|then|else|fi|for|while|do|done|case|esac|function|export|source|echo|read|set|unset|alias|declare|typeset|local|shift|test|eval|exec)\b/g,
        comments: /#.*$/gm,
        shebangs: /#!\/bin\/(bash|sh)/g,
        variables: /(\$[\w@]+|\${[\w@]+})/g,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad',
        commentColor: '#008000',
        variableColor: '#87ceeb',
        stringColor: '#ff0000',
        shebangColor: '#008000'
      },
      cpp: {
        keywords: /\b(int|double|float|char|void|class|struct|namespace|public|private|protected|if|else|for|while|return|new|delete|try|catch|throw|using|const|static|virtual)\b/g,
        comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
        variables: /(int|double|float|char)\s+(\w+)/g,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad',
        commentColor: '#008000',
        variableColor: '#87ceeb',
        stringColor: '#ff0000'
      },
      ruby: {
        keywords: /\b(def|class|module|if|else|elsif|for|while|return|require|include|extend|begin|rescue|ensure|end|true|false|nil)\b/g,
        comments: /#.*$/gm,
        variables: /def\s+(\w+)/g,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad',
        commentColor: '#008000',
        variableColor: '#87ceeb',
        stringColor: '#ff0000'
      },
      go: {
        keywords: /\b(func|package|import|type|struct|interface|if|else|for|range|return|go|defer|chan|map|const|var|true|false|nil)\b/g,
        comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)/gm,
        variables: /(var|const)\s+(\w+)/g,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad',
        commentColor: '#008000',
        variableColor: '#87ceeb',
        stringColor: '#ff0000'
      },
      php: {
        keywords: /\b(function|class|if|else|for|while|return|echo|print|new|try|catch|public|private|protected|static|const|global|namespace)\b/g,
        comments: /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(#.*$)/gm,
        variables: /\$(\w+)/g,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad',
        commentColor: '#008000',
        variableColor: '#87ceeb',
        stringColor: '#ff0000'
      },
      css: {
        properties: /\b(color|background|margin|padding|border|font|display|flex|grid|position|width|height|top|right|bottom|left)\b/g,
        comments: /\/\*[\s\S]*?\*\//gm,
        strings: /("[^"]*"|'[^']*')/g,
        propertyColor: '#6a0dad',
        commentColor: '#008000',
        stringColor: '#ff0000'
      },
      sql: {
        keywords: /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|GROUP|BY|ORDER|HAVING|CREATE|TABLE|INDEX|VIEW|PROCEDURE|FUNCTION|TRIGGER|PRIMARY|FOREIGN|KEY)\b/g,
        comments: /(--.*$)|(\/\*[\s\S]*?\*\/)/gm,
        strings: /("[^"]*"|'[^']*')/g,
        keywordColor: '#6a0dad',
        commentColor: '#008000',
        stringColor: '#ff0000'
      },
      json: {
        strings: /("[^"]*")/g,
        stringColor: '#ff0000'
      },
      yaml: {
        comments: /#.*$/gm,
        strings: /("[^"]*"|'[^']*')/g,
        commentColor: '#008000',
        stringColor: '#ff0000'
      },
      markdown: {
        headers: /^(#{1,6})\s+(.*)$/gm,
        inlineCode: /`([^`]+)`/g,
        links: /\[([^\]]+)\]\(([^)]+)\)/g,
        headerColor: '#6a0dad',
        codeColor: '#1e293b',
        linkColor: '#3b82f6'
      }
    };

    const rule = rules[language] || {
      strings: /("[^"]*"|'[^']*')/g,
      stringColor: '#ff0000'
    };

    // Apply highlighting in order to avoid overlaps
    // 1. Comments (to prevent other patterns from matching inside comments)
    if (rule.comments) {
      highlightedCode = highlightedCode.replace(rule.comments, '<span style="color: #008000">$&</span>');
    }

    // 2. Shebangs (for bash)
    if (rule.shebangs) {
      highlightedCode = highlightedCode.replace(rule.shebangs, '<span style="color: #008000">$&</span>');
    }

    // 3. Strings
    if (rule.strings) {
      highlightedCode = highlightedCode.replace(rule.strings, '<span style="color: #ff0000">$1</span>');
    }

    // 4. Keywords or Properties
    if (rule.keywords) {
      highlightedCode = highlightedCode.replace(rule.keywords, '<span style="color: #6a0dad">$&</span>');
    } else if (rule.properties) {
      highlightedCode = highlightedCode.replace(rule.properties, '<span style="color: #6a0dad">$&</span>');
    }

    // 5. Variables
    if (rule.variables) {
      highlightedCode = highlightedCode.replace(rule.variables, (match, p1, p2) => {
        const varName = p2 || p1; // p2 for most cases, p1 for Bash/PHP assignments
        return match.replace(varName, `<span style="color: #87ceeb">${varName}</span>`);
      });
    }

    // 6. Headers (for markdown)
    if (rule.headers) {
      highlightedCode = highlightedCode.replace(rule.headers, '<span style="color: #6a0dad">$2</span>');
    }

    // 7. Inline Code (for markdown)
    if (rule.inlineCode) {
      highlightedCode = highlightedCode.replace(rule.inlineCode, '<span style="color: #1e293b">$1</span>');
    }

    // 8. Links (for markdown)
    if (rule.links) {
      highlightedCode = highlightedCode.replace(rule.links, '<span style="color: #3b82f6">$1</span>');
    }

    return highlightedCode;
  };

  // Split text by code blocks
  const codeBlockRegex = /```(\w+)?\s*\n?([\s\S]*?)\n?\s*```/g;
  const parts = [];
  let lastIndex = 0;

  // Process code blocks
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    // Add the code block
    parts.push({
      type: 'code',
      language: match[1] ? match[1].toLowerCase() : '',
      content: match[2].trim()
    });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last code block
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  const components = [];
  let listCounter = 0; // To ensure unique keys for lists
  let codeBlockCounter = 0; // To ensure unique keys for code blocks

  parts.forEach((part, idx) => {
    if (part.type === 'code') {
      const codeBlockId = `code-block-${messageIndex}-${idx}-${codeBlockCounter++}`;
      const highlightedCode = part.language in {
        python: 1, javascript: 1, java: 1, html: 1, bash: 1,
        cpp: 1, ruby: 1, go: 1, php: 1, css: 1, sql: 1,
        json: 1, yaml: 1, markdown: 1
      } ? syntaxHighlight(part.content, part.language) : part.content;

      // Unified code block style
      const codeStyle = {
        background: '#2d2d2d',
        color: '#ffffff',
        fontFamily: 'monospace',
        padding: '1rem',
        borderRadius: '8px',
        overflowX: 'auto',
        overflowY: 'auto',
        maxHeight: '300px',
        maxWidth: '100%',
        boxSizing: 'border-box',
        lineHeight: '1.5',
        border: '1px solid #444444',
        margin: '0.5rem 0'
      };

      const codeInnerStyle = {
        maxWidth: '100%',
        boxSizing: 'border-box',
        whiteSpace: 'pre',
        display: 'block'
      };

      const copyButtonStyle = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.3rem',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        width: '24px',
        height: '24px'
      };

      const tooltipStyle = {
        position: 'absolute',
        top: '-24px',
        right: '0',
        backgroundColor: '#333',
        color: '#fff',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1
      };

      components.push(
        <div key={codeBlockId} style={{ position: 'relative', maxWidth: '100%', boxSizing: 'border-box' }}>
          <pre style={codeStyle}>
            <code style={codeInnerStyle} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </pre>
          <button
            style={copyButtonStyle}
            onClick={() => handleCopy(part.content, codeBlockId)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
            aria-label="Copy code"
          >
            <FiCopy size={14} color="#4b5563" />
          </button>
          {copiedStates[codeBlockId] && (
            <span style={tooltipStyle}>
              Copied!
            </span>
          )}
        </div>
      );
      return;
    }

    // Handle text parts (paragraphs, headings, lists, etc.)
    const paragraphs = part.content.split('\n\n').filter(p => p.trim());

    paragraphs.forEach((para, paraIdx) => {
      // Handle separators
      if (para.trim() === '---' || para.trim() === '⸻') {
        components.push(<hr key={`sep-${idx}-${paraIdx}`} style={{ margin: '1rem 0', border: '1px solid #e2e8f0' }} />);
        return;
      }

      // Handle headings (e.g., "**1. Heading:**")
      if (para.match(/^\*\*[0-9]+\.\s+.*:\*\*/)) {
        const headingText = para.replace(/^\*\*[0-9]+\.\s+/, '').replace(/:\*\*$/, '').trim();
        const emoji = Object.keys(emojiMap).find(key => headingText.includes(key)) ? emojiMap[Object.keys(emojiMap).find(key => headingText.includes(key))] : '';
        components.push(
          <h3 key={`h3-${idx}-${paraIdx}`} style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '1rem 0', wordBreak: 'break-word' }}>
            {emoji} {headingText}
          </h3>
        );
        return;
      }

      // Handle lists (e.g., "* Item" or "  * Subitem")
      if (para.match(/^\s*\* /)) {
        const items = para.split('\n').filter(line => line.trim());
        const listItems = [];
        let currentList = [];

        items.forEach((item, i) => {
          const indent = item.match(/^\s*/)[0].length / 2; // Count indentation (2 spaces = 1 level)
          const text = item.replace(/^\s*\* /, '').trim();

          // Parse inline Markdown: bold, links, and inline code
          const parsedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: none; border-bottom: 1px solid #3b82f6;">$1</a>')
            .replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px; color: #1e293b; font-family: monospace">$1</code>');

          if (indent === 0) {
            if (currentList.length) {
              listItems.push(
                <ul key={`ul-${listCounter}-${idx}-${paraIdx}-${i}`} style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                  {currentList}
                </ul>
              );
              currentList = [];
              listCounter++;
            }
            currentList.push(
              <li key={`li-${listCounter}-${idx}-${paraIdx}-${i}`} style={{ margin: '0.25rem 0', color: '#1e293b', wordBreak: 'break-word' }}>
                <span dangerouslySetInnerHTML={{ __html: parsedText }} />
              </li>
            );
          } else {
            currentList.push(
              <li key={`li-${listCounter}-${idx}-${paraIdx}-${i}`} style={{ margin: '0.25rem 0', color: '#1e293b', paddingLeft: `${indent * 1}rem`, wordBreak: 'break-word' }}>
                <span dangerouslySetInnerHTML={{ __html: parsedText }} />
              </li>
            );
          }
        });

        if (currentList.length) {
          listItems.push(
            <ul key={`ul-${listCounter}-${idx}-${paraIdx}-final`} style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              {currentList}
            </ul>
          );
          listCounter++;
        }
        components.push(...listItems);
        return;
      }

      // Handle regular paragraphs with bold, links, inline code, and emojis
      let parsedPara = para
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: none; border-bottom: 1px solid #3b82f6;">$1</a>')
        .replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px; color: #1e293b; font-family: monospace">$1</code>');

      // Add emojis based on keywords
      Object.keys(emojiMap).forEach(key => {
        if (parsedPara.includes(key)) {
          parsedPara = `${emojiMap[key]} ${parsedPara}`;
        }
      });

      components.push(
        <p key={`p-${idx}-${paraIdx}`} style={{ margin: '0.5rem 0', color: '#1e293b', wordBreak: 'break-word' }}>
          <span dangerouslySetInnerHTML={{ __html: parsedPara }} />
        </p>
      );
    });
  });

  return components;
};

export default parseMarkdown;