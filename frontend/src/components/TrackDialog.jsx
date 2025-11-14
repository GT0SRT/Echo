import React, { useState, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "../ui/dialog";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TracksContext } from "../context/TracksContext";

export default function TrackDialog() {
    const { addTrack } = useContext(TracksContext);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        language: "",
        nativeLanguage: "",
        level: "",
        accent: "",
        currentFluency: "",
        desiredFluency: "",
    });

    const handleChange = (key, value) => {
        setForm((p) => ({ ...p, [key]: value }));
    };

    const handleAdd = async () => {
        if (!form.language) {
            alert("Please select a language");
            return;
        }

        try {
            // Call backend API to generate learning track
            const response = await fetch("http://localhost:8000/onboarding/generate-track", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language: form.language,
                    goal: `Learning ${form.language} as a ${form.nativeLanguage || "English"} speaker at ${form.level || "Beginner"} level`,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            const newTrack = {
                id: Date.now().toString(),
                name: form.name || `${form.language} Track`,
                title: form.name || `${form.language} Track`,
                language: form.language,
                nativeLanguage: form.nativeLanguage || "English",
                level: form.level || "Beginner",
                accent: form.accent || "",
                currentFluency: form.currentFluency || "",
                desiredFluency: form.desiredFluency || "",
                systemPrompt: data.system_prompt || "",
                initialTopics: data.initial_topics || [],
            };

            addTrack(newTrack);
            setOpen(false);
            setForm({
                name: "",
                language: "",
                nativeLanguage: "",
                level: "",
                accent: "",
                currentFluency: "",
                desiredFluency: "",
            });
        } catch (error) {
            console.error("Error creating track:", error);
            alert(`Failed to create track: ${error.message}. Make sure the backend is running on http://localhost:8000`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="w-full py-2 rounded-lg bg-cyan-600 text-white">Add Track</DialogTrigger>

            <DialogContent className="bg-[#0e0e0e] border border-[#1f1f1f] text-white max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Track</DialogTitle>
                    <DialogDescription>
                        Set up your personalized language learning track
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <Label>Track Name</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="e.g., Spanish for Travelers"
                            className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                        />
                    </div>

                    <div>
                        <Label>Language to learn</Label>
                        <Select onValueChange={(v) => handleChange("language", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                                <SelectItem value="Japanese">Japanese</SelectItem>
                                <SelectItem value="Korean">Korean</SelectItem>
                                <SelectItem value="Hindi">Hindi</SelectItem>
                                <SelectItem value="Mandarin">Mandarin</SelectItem>
                                <SelectItem value="English">English</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Native language</Label>
                        <Select onValueChange={(v) => handleChange("nativeLanguage", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select native language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Hindi">Hindi</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                                <SelectItem value="Japanese">Japanese</SelectItem>
                                <SelectItem value="Korean">Korean</SelectItem>
                                <SelectItem value="Mandarin">Mandarin</SelectItem>
                                <SelectItem value="Arabic">Arabic</SelectItem>
                                <SelectItem value="Russian">Russian</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Current level</Label>
                        <Select onValueChange={(v) => handleChange("level", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Accent preference</Label>
                        <Select onValueChange={(v) => handleChange("accent", v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select accent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="American">American</SelectItem>
                                <SelectItem value="British">British</SelectItem>
                                <SelectItem value="Australian">Australian</SelectItem>
                                <SelectItem value="Canadian">Canadian</SelectItem>
                                <SelectItem value="Indian">Indian</SelectItem>
                                <SelectItem value="Irish">Irish</SelectItem>
                                <SelectItem value="Scottish">Scottish</SelectItem>
                                <SelectItem value="South African">South African</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Current fluency</Label>
                            <Select onValueChange={(v) => handleChange("currentFluency", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A1">A1</SelectItem>
                                    <SelectItem value="A2">A2</SelectItem>
                                    <SelectItem value="B1">B1</SelectItem>
                                    <SelectItem value="B2">B2</SelectItem>
                                    <SelectItem value="C1">C1</SelectItem>
                                    <SelectItem value="C2">C2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Desired fluency</Label>
                            <Select onValueChange={(v) => handleChange("desiredFluency", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A1">A1</SelectItem>
                                    <SelectItem value="A2">A2</SelectItem>
                                    <SelectItem value="B1">B1</SelectItem>
                                    <SelectItem value="B2">B2</SelectItem>
                                    <SelectItem value="C1">C1</SelectItem>
                                    <SelectItem value="C2">C2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>


                    <div className="flex justify-end gap-2">
                        <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-md border border-slate-700">Cancel</button>
                        <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-cyan-600 text-white">Save Track</button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
