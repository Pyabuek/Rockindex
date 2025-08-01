import React, { useState, useEffect } from 'react';
import { Eye, Copy, Check } from 'lucide-react';

const CopyButton: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors whitespace-nowrap ${className}`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

const ParameterBadge: React.FC<{ children: React.ReactNode; variant?: 'param' | 'type' | 'default' }> = ({ 
  children, 
  variant = 'param' 
}) => {
  const baseClasses = "px-2 py-1 rounded text-xs font-mono";
  const variantClasses = {
    param: "bg-gray-700 text-white",
    type: "bg-blue-900 text-blue-200",
    default: "bg-green-900 text-green-200"
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

function App() {
  const [activePlayer, setActivePlayer] = useState<'movie' | 'tv'>('movie');
  const [activeTab, setActiveTab] = useState('embedding');
  const [showTryItFrame, setShowTryItFrame] = useState(false);
  const [movieId, setMovieId] = useState('533535');
  const [tvId, setTvId] = useState('94997');
  const [season, setSeason] = useState('1');
  const [episode, setEpisode] = useState('1');
  const [currentUrl, setCurrentUrl] = useState('');

  const updateUrl = () => {
    let url = '';
    if (activePlayer === 'movie') {
      url = `https://vidrock.net/movie/${movieId}`;
    } else {
      url = `https://vidrock.net/tv/${tvId}/${season}/${episode}`;
    }
    setCurrentUrl(url);
  };

  useEffect(() => {
    updateUrl();
  }, [activePlayer, movieId, tvId, season, episode]);

  const parameters = [
    {
      name: 'autoplay',
      type: 'boolean',
      default: 'false',
      description: 'Automatically start playing the video when loaded'
    },
    {
      name: 'autonext',
      type: 'boolean',
      default: 'false',
      description: 'Plays next TV episode automatically'
    },
    {
      name: 'theme',
      type: 'hex color',
      default: 'ffffff',
      description: 'Custom accent color (without #). Changes player theme colors'
    },
    {
      name: 'download',
      type: 'boolean',
      default: 'true',
      description: 'Show/hide the download button in player controls'
    },
    {
      name: 'nextbutton',
      type: 'boolean',
      default: 'true',
      description: 'Show/hide next episode notification for TV shows'
    },
    {
      name: 'episodeselector',
      type: 'boolean',
      default: 'true',
      description: 'Show/hide the season/episode selector button'
    },
    {
      name: 'lang',
      type: 'language code',
      default: 'none',
      description: 'Auto-select subtitles by language (e.g., \'en\', \'es\', \'fr\'). Uses 2-letter ISO codes'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-start px-8 py-4 bg-gray-900">
        <div className="flex items-center gap-2">
          <img 
            src="https://vidrock.net/vidrock.png" 
            alt="VidRock Logo" 
            className="h-8"
          />
          <span className="text-xl font-bold text-gray-400">idRock</span>
        </div>
      </header>

      {/* Player Type Buttons */}
      <div className="flex justify-center mt-5">
        <div className="inline-flex rounded-lg overflow-hidden shadow-lg">
          <button
            onClick={() => setActivePlayer('movie')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activePlayer === 'movie'
                ? 'bg-black text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Movie Player
          </button>
          <button
            onClick={() => setActivePlayer('tv')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activePlayer === 'tv'
                ? 'bg-black text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Series Player
          </button>
        </div>
      </div>

      {/* Input Forms */}
      <div className="flex justify-center mt-4 px-4">
        {activePlayer === 'movie' ? (
          <div className="flex justify-center max-w-md w-full">
            <input
              type="text"
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              placeholder="TMDB or IMDB ID"
              className="w-full max-w-40 px-3 py-2 text-sm text-center bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
        ) : (
          <div className="flex gap-2 max-w-md w-full justify-center">
            <input
              type="text"
              value={tvId}
              onChange={(e) => setTvId(e.target.value)}
              placeholder="TMDB or IMDB ID"
              className="flex-1 max-w-32 px-3 py-2 text-sm text-center bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
            <input
              type="text"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              placeholder="Season"
              className="flex-1 max-w-20 px-3 py-2 text-sm text-center bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
            <input
              type="text"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              placeholder="Episode"
              className="flex-1 max-w-20 px-3 py-2 text-sm text-center bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>
        )}
      </div>

      {/* URL Display */}
      <div className="px-4 mt-3">
        <div className="max-w-4xl mx-auto">
          <input
            type="text"
            value={currentUrl}
            readOnly
            className="w-full px-3 py-2 text-sm text-center bg-gray-900 border border-gray-600 rounded text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Video Player */}
      <div className="flex justify-center mt-4 px-4">
        <iframe
          src={currentUrl}
          className="w-full max-w-4xl h-96 border border-gray-600 rounded-lg shadow-lg"
          allowFullScreen
        />
      </div>

      {/* Features Section */}
      <section className="px-8 py-8 max-w-6xl mx-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '🚀', title: 'Easy to use', desc: 'Intuitive and easy to use. Just copy the link and embed it into your website' },
            { icon: '📚', title: 'Huge Library', desc: 'With movies and shows scraped from multiple websites, we have it all!' },
            { icon: '🎨', title: 'Customizable', desc: 'You can customize the player to your needs using only query parameters' },
            { icon: '🔄', title: 'Auto Update', desc: 'Content added every day, updated automatically' },
            { icon: '🎬', title: 'Highest Quality', desc: 'Latest available quality and the fastest' }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <span>{feature.icon}</span>
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Documentation */}
      <section className="bg-gray-900 px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-400 mb-6">API Documentation</h2>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-700">
            {[
              { id: 'embedding', label: 'Embedding' },
              { id: 'customization', label: 'Customization' },
              { id: 'watch-progress', label: 'Watch Progress' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white border-b-2 border-gray-600'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'embedding' && (
            <div className="space-y-6">
              <p className="text-gray-300">Comprehensive API reference for embedding movies and series using TMDB or IMDB IDs.</p>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Movie Embed URL</h3>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <code className="text-sm text-gray-300 bg-gray-900 px-3 py-1 rounded flex-1 break-all">
                      https://vidsrc.vip/embed/movie/{'{tmdb_id}'}
                    </code>
                    <CopyButton text="https://vidsrc.vip/embed/movie/{tmdb_id}" className="flex-shrink-0" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <code className="text-sm text-gray-300 bg-gray-900 px-3 py-1 rounded flex-1 break-all">
                      https://vidsrc.vip/embed/movie/{'{imdb_id}'}
                    </code>
                    <CopyButton text="https://vidsrc.vip/embed/movie/{imdb_id}" className="flex-shrink-0" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Example iframe:</h4>
                  <div className="flex items-start justify-between gap-4">
                    <code className="text-sm text-gray-300 bg-gray-900 px-3 py-1 rounded flex-1 break-all">
                      &lt;iframe src="https://vidsrc.vip/embed/movie/tt1234567" allowfullscreen&gt;&lt;/iframe&gt;
                    </code>
                    <CopyButton text='<iframe src="https://vidsrc.vip/embed/movie/tt1234567" allowfullscreen></iframe>' className="flex-shrink-0" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">TV Shows Embed URL</h3>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <code className="text-sm text-gray-300 bg-gray-900 px-3 py-1 rounded flex-1 break-all">
                      https://vidsrc.vip/embed/tv/{'{tmdb_id}'}/{'{season_number}'}/{'{episode_number}'}
                    </code>
                    <CopyButton text="https://vidsrc.vip/embed/tv/{tmdb_id}/{season_number}/{episode_number}" className="flex-shrink-0" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <code className="text-sm text-gray-300 bg-gray-900 px-3 py-1 rounded flex-1 break-all">
                      https://vidsrc.vip/embed/tv/{'{imdb_id}'}/{'{season_number}'}/{'{episode_number}'}
                    </code>
                    <CopyButton text="https://vidsrc.vip/embed/tv/{imdb_id}/{season_number}/{episode_number}" className="flex-shrink-0" />
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Example iframe:</h4>
                  <div className="flex items-start justify-between gap-4">
                    <code className="text-sm text-gray-300 bg-gray-900 px-3 py-1 rounded flex-1 break-all">
                      &lt;iframe src="https://vidsrc.vip/embed/tv/tt9876543/1/1" allowfullscreen&gt;&lt;/iframe&gt;
                    </code>
                    <CopyButton text='<iframe src="https://vidsrc.vip/embed/tv/tt9876543/1/1" allowfullscreen></iframe>' className="flex-shrink-0" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">List All Movies & Series</h3>
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <code className="text-sm text-gray-300 bg-gray-900 px-3 py-1 rounded flex-1 break-all">
                      https://vidsrc.vip/list/movie.json
                    </code>
                    <CopyButton text="https://vidsrc.vip/list/movie.json" className="flex-shrink-0" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <code className="text-sm text-gray-300 bg-gray-900 px-3 py-1 rounded flex-1 break-all">
                      https://vidsrc.vip/list/tv.json
                    </code>
                    <CopyButton text="https://vidsrc.vip/list/tv.json" className="flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customization' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-gray-400" />
                <h3 className="text-xl font-bold">Available URL Parameters</h3>
              </div>
              <p className="text-gray-400 mb-8">Customize the player behavior by adding these parameters to your URLs</p>
              
              <div className="space-y-6">
                {parameters.map((param, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <div className="flex flex-wrap items-start gap-3 mb-3">
                      <ParameterBadge variant="param">{param.name}</ParameterBadge>
                      <ParameterBadge variant="type">{param.type}</ParameterBadge>
                      <ParameterBadge variant="default">default: {param.default}</ParameterBadge>
                    </div>
                    <p className="text-gray-400 text-sm break-words">{param.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6">Parameter Examples</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Enable autoplay:</h4>
                    <div className="flex items-start justify-between gap-4 bg-gray-800 p-3 rounded">
                      <code className="text-sm text-gray-300">?autoplay=true</code>
                      <CopyButton text="?autoplay=true" className="flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Custom red theme:</h4>
                    <div className="flex items-start justify-between gap-4 bg-gray-800 p-3 rounded">
                      <code className="text-sm text-gray-300">?theme=ff6b6b</code>
                      <CopyButton text="?theme=ff6b6b" className="flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Hide download button:</h4>
                    <div className="flex items-start justify-between gap-4 bg-gray-800 p-3 rounded">
                      <code className="text-sm text-gray-300">?download=false</code>
                      <CopyButton text="?download=false" className="flex-shrink-0" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Multiple parameters:</h4>
                    <div className="flex items-start justify-between gap-4 bg-gray-800 p-3 rounded">
                      <code className="text-sm text-gray-300 break-all">https://vidrock.net/tv/1399/1/1?autoplay=true&autonext=true&theme=00ff00&download=false</code>
                      <CopyButton text="https://vidrock.net/tv/1399/1/1?autoplay=true&autonext=true&theme=00ff00&download=false" className="flex-shrink-0" />
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => setShowTryItFrame(!showTryItFrame)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        {showTryItFrame ? 'Hide Preview' : 'Try it'}
                      </button>
                      {showTryItFrame && (
                        <div className="mt-4">
                          <iframe
                            src="https://vidrock.net/tv/1399/1/1?autoplay=true&autonext=true&theme=00ff00&download=false"
                            className="w-full h-64 border border-gray-600 rounded-lg"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Enable autonext parameter:</h4>
                    <div className="flex items-center justify-between gap-4 bg-gray-800 p-3 rounded">
                      <code className="text-sm text-gray-300">?autonext=true</code>
                      <CopyButton text="?autonext=true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'watch-progress' && (
            <div className="space-y-6">
              <p className="text-gray-300">Track and manage watch progress for users.</p>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Watch Progress API</h3>
                <p className="text-gray-400">Currently, watch progress tracking is not supported via API. Please check back for updates.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;