import { useState, useRef } from "react";
import "./App.css";
import { generateTop8Image } from "./generateTop8Image";
import type { FormData, Player } from "./types";

function App() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    date: "",
    backgroundImage: null,
    backgroundImagePreview: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    players: Array(8)
      .fill(null)
      .map(() => ({
        tag: "",
        image: null,
        imagePreview: "",
        position: "",
      })),
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBackgroundImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          backgroundImage: file,
          backgroundImagePreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange =
    (field: "primaryColor" | "secondaryColor") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handlePlayerChange =
    (index: number, field: keyof Player) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "image") {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFormData((prev) => ({
              ...prev,
              players: prev.players.map((player, i) =>
                i === index
                  ? {
                      ...player,
                      image: file,
                      imagePreview: e.target?.result as string,
                    }
                  : player
              ),
            }));
          };
          reader.readAsDataURL(file);
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          players: prev.players.map((player, i) =>
            i === index ? { ...player, [field]: e.target.value } : player
          ),
        }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    await generateTop8Image({
      canvas,
      title: formData.title,
      date: formData.date,
      backgroundImagePreview: formData.backgroundImagePreview,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      players: formData.players,
    });
    setPreviewUrl(canvas.toDataURL("image/png"));
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.download = "top8.png";
    link.href = previewUrl;
    link.click();
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Top Eight Generator</h1>
        <form onSubmit={handleSubmit} className="form">
          {/* Title and Date Section */}
          <div className="section">
            <h2>Event Info</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., FATAL FURY BRASIL TOP 8"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="e.g., 21/06/2025 (DD/MM/YYYY)"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Background and Colors Section */}
          <div className="section">
            <h2>Background & Colors</h2>

            <div className="form-group">
              <label htmlFor="backgroundImage">Background Image:</label>
              <input
                type="file"
                id="backgroundImage"
                accept="image/*"
                onChange={handleBackgroundImageChange}
                className="form-input file-input"
              />
              {formData.backgroundImagePreview && (
                <div className="image-preview">
                  <img
                    src={formData.backgroundImagePreview}
                    alt="Background preview"
                    className="preview-image"
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="primaryColor">Primary Color:</label>
                <input
                  type="color"
                  id="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleColorChange("primaryColor")}
                  className="form-input color-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="secondaryColor">Secondary Color:</label>
                <input
                  type="color"
                  id="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleColorChange("secondaryColor")}
                  className="form-input color-input"
                />
              </div>
            </div>
          </div>

          {/* Players Section */}
          <div className="section">
            <h2>Players</h2>
            <p className="section-description">
              Enter information for all 8 players
            </p>

            <div className="players-grid">
              {formData.players.map((player, index) => (
                <div key={index} className="player-card">
                  <h3>Player {index + 1}</h3>

                  <div className="form-group">
                    <label htmlFor={`player-${index}-tag`}>Player Tag:</label>
                    <input
                      type="text"
                      id={`player-${index}-tag`}
                      value={player.tag}
                      onChange={handlePlayerChange(index, "tag")}
                      placeholder="Enter player tag"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor={`player-${index}-image`}>
                      Player Image:
                    </label>
                    <input
                      type="file"
                      id={`player-${index}-image`}
                      accept="image/*"
                      onChange={handlePlayerChange(index, "image")}
                      className="form-input file-input"
                    />
                    {player.imagePreview && (
                      <div className="image-preview">
                        <img
                          src={player.imagePreview}
                          alt={`Player ${index + 1} preview`}
                          className="preview-image"
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor={`player-${index}-position`}>
                      Position:
                    </label>
                    <input
                      type="number"
                      id={`player-${index}-position`}
                      value={player.position}
                      onChange={handlePlayerChange(index, "position")}
                      placeholder="e.g., 1, 2, 3, 4, 5, 6, 7, 8"
                      className="form-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Generate Top Eight
            </button>
          </div>
        </form>
        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {/* Preview and download section */}
        {previewUrl && (
          <div className="preview-section">
            <h2>Preview</h2>
            <img
              src={previewUrl}
              alt="Top 8 Preview"
              style={{
                maxWidth: "100%",
                border: "2px solid #ccc",
                marginBottom: 16,
              }}
            />
            <br />
            <button
              onClick={handleDownload}
              className="submit-button"
              type="button"
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
