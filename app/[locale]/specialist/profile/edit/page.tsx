const loadProfile = async () => {
  try {
    const res = await fetch('/api/specialist/me')
    const data = await res.json()
    console.log('Profile data:', data, 'ok:', res.ok)
    if (res.ok) {
      setBusinessName(data.businessName || '')
      setDescription(data.description || '')
      setPhone(data.phone || '')
      setExperience(data.experienceYears?.toString() || '')
      setProfileImage(data.user?.image || null)
      setGallery((data.gallery || []).map((g: any) => g.imageUrl))
    } else {
      setMessage('Грешка при зареждане на профила')
      setMessageType('error')
    }
  } catch (error) {
    console.error('loadProfile error:', error)
    setMessage('Грешка при зареждане')
    setMessageType('error')
  } finally {
    setLoading(false)
  }
}