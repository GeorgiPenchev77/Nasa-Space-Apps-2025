import { useEffect, useState } from "react";
import { ExternalLink, Sparkles, X } from "lucide-react";
import axios from "axios";

const containerStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(30, 20, 50, 0.92)',
  borderRadius: '18px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  border: '1px solid rgba(255,255,255,0.12)',
  overflow: 'hidden',
  height: '85vh',
  backdropFilter: 'blur(8px)',
  position: 'relative'
};

const headerStyle = {
  flexShrink: 0,
  padding: '24px 28px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  position: 'sticky',
  top: 0,
  background: 'rgba(30, 20, 50, 0.95)',
  zIndex: 10
};

const titleStyle = {
  fontSize: '1.75rem',
  fontWeight: 700,
  color: 'white',
  marginBottom: '12px',
  lineHeight: 1.3
};

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: '#a78bfa',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  fontSize: '0.95rem'
};

const contentStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '24px 28px',
  color: '#e5e5e5',
  lineHeight: 1.7,
  whiteSpace: 'pre-line',
  fontSize: '1rem',
  position: 'relative',
  userSelect: 'text'
};

const placeholderStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '1.1rem',
  background: 'rgba(30, 20, 50, 0.92)',
  borderRadius: '18px',
  padding: '24px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  border: '1px solid rgba(255,255,255,0.12)',
  backdropFilter: 'blur(8px)'
};

const tooltipStyle = {
  position: 'absolute',
  background: 'rgba(20, 10, 40, 0.98)',
  border: '1px solid rgba(168, 139, 250, 0.4)',
  borderRadius: '12px',
  padding: '16px',
  maxWidth: '320px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
  zIndex: 1000,
  backdropFilter: 'blur(10px)'
};

const tooltipHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
  paddingBottom: '8px',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const tooltipTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#c4b5fd',
  fontSize: '0.9rem',
  fontWeight: 600
};

const closeButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'rgba(255,255,255,0.6)',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  transition: 'all 0.2s ease'
};

const tooltipContentStyle = {
  color: '#e5e5e5',
  fontSize: '0.9rem',
  lineHeight: 1.5
};

const selectedWordStyle = {
  color: '#c4b5fd',
  fontWeight: 600,
  marginBottom: '8px'
};

export default function ArticleWindow({ article }) {
  const [abstractText, setAbstractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [tooltip, setTooltip] = useState(null);
  const [explainLoading, setExplainLoading] = useState(false);

  useEffect(() => {
    if (article) {
      fetchAbstract();
    }
  }, [article]);

  const extractPMCId = (url) => {
    const match = url.match(/PMC\d+/);
    return match ? match[0] : null;
  };

  const fetchAbstract = async () => {
    const pmcId = extractPMCId(article.url);
    if (!pmcId) return;

    setLoading(true);
    setError(null);
    setAbstractText("");
    setTooltip(null);

    try {
      const res = await axios.get(`/api/pubs/get-xml?pmcId=${pmcId}`, {
        headers: { Accept: "application/xml" },
      });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(res.data, "application/xml");

      const passages = xmlDoc.getElementsByTagName("passage");
      let abstract = "Abstract\n\n";

      for (let i = 0; i < passages.length; i++) {
        const infons = passages[i].getElementsByTagName("infon");
        for (let j = 0; j < infons.length; j++) {
          if (infons[j].textContent.toLowerCase() === "abstract") {
            const textNode = passages[i].getElementsByTagName("text")[0];
            if (textNode) abstract += textNode.textContent + "\n\n";
          }
        }
      }

      if (!abstract) {
        const textNodes = xmlDoc.getElementsByTagName("text");
        for (let i = 0; i < textNodes.length; i++) {
          const text = textNodes[i].textContent;
          if (text && text.toLowerCase().includes("abstract")) {
            abstract += text + "\n\n";
            break;
          }
        }
      }

      setAbstractText(abstract.trim() || "No abstract available for this article.");
    } catch (err) {
      console.error("Error fetching abstract:", err);
      setError("Failed to load abstract.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextSelection = async (e) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (!selectedText || selectedText.length < 2) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = e.currentTarget.getBoundingClientRect();

    // Calculate initial position
    let tooltipX = rect.left - containerRect.left + (rect.width / 2);
    let tooltipY = rect.top - containerRect.top - 10;

    // Estimate tooltip dimensions (adjust these if needed)
    const tooltipWidth = 320;
    const tooltipHeight = 150;
    const padding = 20;

    // Check if tooltip would go off the left edge
    if (tooltipX - tooltipWidth / 2 < padding) {
      tooltipX = tooltipWidth / 2 + padding;
    }

    // Check if tooltip would go off the right edge
    if (tooltipX + tooltipWidth / 2 > containerRect.width - padding) {
      tooltipX = containerRect.width - tooltipWidth / 2 - padding;
    }

    // Check if tooltip would go off the top - if so, place it below the selection
    let placement = 'above';
    if (tooltipY - tooltipHeight < padding) {
      tooltipY = rect.bottom - containerRect.top + 10;
      placement = 'below';
    }

    setTooltip({
      text: selectedText,
      x: tooltipX,
      y: tooltipY,
      placement: placement,
      explanation: null
    });

    setExplainLoading(true);

    try {
      const response = await axios.post('/api/gemini/simplify', {
        text: selectedText
      });

      setTooltip(prev => prev ? {
        ...prev,
        explanation: response.data.reply
      } : null);
    } catch (err) {
      console.error("Error getting explanation:", err);
      setTooltip(prev => prev ? {
        ...prev,
        explanation: "Failed to get explanation. Please try again."
      } : null);
    } finally {
      setExplainLoading(false);
    }
  };

  const closeTooltip = () => {
    setTooltip(null);
    window.getSelection().removeAllRanges();
  };

  if (!article) {
    return (
      <div style={placeholderStyle}>
        Select an article to view details.
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          {article.title}
        </h2>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onMouseEnter={(e) => e.currentTarget.style.color = '#c4b5fd'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#a78bfa'}
        >
          Open full article <ExternalLink size={16} />
        </a>
      </div>

      <div 
        style={contentStyle}
        onMouseUp={handleTextSelection}
      >
        {loading && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
            Loading abstract...
          </p>
        )}
        {error && (
          <p style={{ color: '#fca5a5', fontStyle: 'italic' }}>{error}</p>
        )}
        {!loading && !error && abstractText && (
          <p>{abstractText}</p>
        )}

        {tooltip && (
          <div
            style={{
              ...tooltipStyle,
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: tooltip.placement === 'below' 
                ? 'translateX(-50%)' 
                : 'translateX(-50%) translateY(-100%)'
            }}
          >
            <div style={tooltipHeaderStyle}>
              <div style={tooltipTitleStyle}>
                <Sparkles size={16} />
                <span>AI Explanation</span>
              </div>
              <button
                onClick={closeTooltip}
                style={closeButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                }}
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={selectedWordStyle}>
              "{tooltip.text}"
            </div>
            
            <div style={tooltipContentStyle}>
              {explainLoading ? (
                <span style={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                  Getting explanation...
                </span>
              ) : tooltip.explanation ? (
                tooltip.explanation
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                  No explanation available
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}