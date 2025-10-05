import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
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
  backdropFilter: 'blur(8px)'
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
  fontSize: '1rem'
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

export default function ArticleWindow({ article }) {
  const [abstractText, setAbstractText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    try {
      const res = await axios.get(`/api/pubs/get-xml?pmcId=${pmcId}`, {
        headers: { Accept: "application/xml" },
      });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(res.data, "application/xml");

      const passages = xmlDoc.getElementsByTagName("passage");
      let abstract = "";

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

      <div style={contentStyle}>
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
      </div>
    </div>
  );
}