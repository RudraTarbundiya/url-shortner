import React, { useState } from 'react';
import { Link, Copy, BarChart3, ExternalLink, Zap, Shield, Clock, Trash2, Delete } from 'lucide-react';

const URLShortener = () => {
  const [ourl, setourl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortId, setShortId] = useState('');
  const [visitCount, setVisitCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [allUrls, setAllUrls] = useState([]);
  const [showAllUrls, setShowAllUrls] = useState(false);

  const API_BASE = 'http://localhost:3000'; // Adjust this to your backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ourl) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/short`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ OrginalURl: ourl }),
      });

      if (!response.ok) {
        throw new Error('Failed to create short URL');
      }

      const data = await response.json();
      setShortUrl(`${API_BASE}/${data.shortId || data.ShortedURl}`);
      setShortId(data.shortId || data.ShortedURl);

      // Refresh the list after creating a new URL
      if (showAllUrls) {
        fetchAllUrls();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getVisitCount = async () => {
    if (!shortId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/visit/${shortId}`);
      if (!response.ok) {
        throw new Error('Failed to get visit count');
      }
      const data = await response.json();
      setVisitCount(data.times || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUrls = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }
      const data = await response.json();
      setAllUrls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const deleteUrl = async (shortId) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/delete/${shortId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      setAllUrls(prev => prev.filter(url => url.ShortedURl !== shortId));


      const successMsg = 'URL deleted successfully!';
      setError(successMsg);
      setTimeout(() => setError(''), 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setourl('');
    setShortUrl('');
    setShortId('');
    setVisitCount(null);
    setError('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl shadow-lg">
              <Link className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            URL Shortener
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform long URLs into short, shareable links instantly. Track clicks and manage your links with ease.
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter URL to shorten
                  </label>
                  <div className="relative">
                    <input
                      id="url"
                      type="url"
                      value={ourl}
                      onChange={(e) => setourl(e.target.value)}
                      placeholder="https://example.com/very-long-url"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700"
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                    />
                    <ExternalLink className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !ourl}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Creating...
                    </div>
                  ) : (
                    'Shorten URL'
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {shortUrl && (
                <div className="mt-8 space-y-4">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <div className="bg-green-100 p-1 rounded-lg mr-2">
                        <Link className="w-4 h-4 text-green-600" />
                      </div>
                      Your shortened URL:
                    </h3>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={shortUrl}
                        readOnly
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none"
                      />
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={getVisitCount}
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {loading ? 'Loading...' : 'Check Visits'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Create Another
                    </button>
                  </div>

                  {visitCount !== null && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Visit Statistics</h4>
                          <p className="text-blue-600 text-2xl font-bold">{visitCount} visits</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* View All URLs Section */}
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    All Shortened URLs
                  </h2>
                  <button
                    onClick={() => {
                      setShowAllUrls(!showAllUrls);
                      if (!showAllUrls) {
                        fetchAllUrls();
                      }
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    {showAllUrls ? 'Hide URLs' : 'Show All URLs'}
                  </button>
                </div>
              </div>

              {showAllUrls && (
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                      <span className="ml-3 text-gray-600">Loading URLs...</span>
                    </div>
                  ) : allUrls.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Link className="w-8 h-8 text-gray-400" />
                      </div>
                      <p>No URLs shortened yet. Create your first one above!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allUrls.map((url, index) => (
                        <div key={url._id || index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-2">
                                <div className="bg-green-100 p-1 rounded mr-2">
                                  <Link className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Short URL:</span>
                              </div>
                              <div className="flex items-center space-x-2 mb-3">
                                <input
                                  type="text"
                                  value={`${API_BASE}/${url.ShortedURl}`}
                                  readOnly
                                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700"
                                />
                                <button
                                  onClick={() => copyToClipboard(`${API_BASE}/${url.ShortedURl}`)}
                                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center text-sm"
                                >
                                  <Copy className="w-4 h-4 mr-1" />
                                  {copied === `${API_BASE}/${url.ShortedURl}` ? 'Copied!' : 'Copy'}
                                </button>
                                <button
                                  onClick={() => deleteUrl(url.ShortedURl)}
                                  disabled={loading}
                                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200 flex items-center text-sm"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </button>
                              </div>

                              <div className="mb-3">
                                <span className="text-sm font-medium text-gray-700 block mb-1">Original URL:</span>
                                <p className="text-sm text-blue-600 break-all">{url.ourl}</p>
                              </div>

                              <div className="flex items-center">
                                <div className="bg-blue-100 p-1 rounded mr-2">
                                  <BarChart3 className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-sm text-gray-600">
                                  <span className="font-semibold text-blue-600">{url.times}</span> visits
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Built with React and powered by your backend API</p>
        </div>
      </div>
    </div>
  );
};

export default URLShortener;